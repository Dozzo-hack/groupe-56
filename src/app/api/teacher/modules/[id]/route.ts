import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';
import Submission from '@/models/Submission';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const resolvedParams = await params;
    const moduleId = resolvedParams.id;

    const submissions = await Submission.find({ module: moduleId }).sort({ createdAt: -1 });
    return NextResponse.json(submissions, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Erreur lors de la récupération des devoirs.' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const resolvedParams = await params;
    let moduleId = resolvedParams.id;
    
    const formData = await request.formData();

    // 🛡️ CORRECTION : Si l'URL contient "upload", on récupère le vrai ID dans le formulaire
    if (moduleId === 'upload') {
      moduleId = formData.get('moduleId') as string;
    }

    if (!moduleId || !mongoose.Types.ObjectId.isValid(moduleId)) {
      return NextResponse.json({ message: 'Identifiant de module manquant ou invalide.' }, { status: 400 });
    }

    const file = formData.get('file') as File;
    const resourceTitle = (formData.get('title') as string) || file?.name;

    if (!file) {
      return NextResponse.json({ message: 'Aucun fichier fourni.' }, { status: 400 });
    }

    // Sauvegarde physique
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'resources');
    await mkdir(uploadDir, { recursive: true });

    const safeFileName = file.name.replace(/\s+/g, '_');
    const uniqueFileName = `${Date.now()}-${safeFileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/resources/${uniqueFileName}`;

    // Mise à jour de la base de données
    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      { $push: { resources: { title: resourceTitle, fileUrl, uploadedAt: new Date() } } },
      { returnDocument: 'after' } 
    );

    if (!updatedModule) {
      return NextResponse.json({ message: 'Module introuvable.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Ressource ajoutée avec succès !', module: updatedModule }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur POST ressource :", error);
    return NextResponse.json({ message: "Erreur lors de l'upload.", error: error.message }, { status: 500 });
  }
}