import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';
import * as jose from 'jose';

function extractTeacherId(payload: any): string | null {
  let teacherId = payload.id || payload.userId;
  if (!teacherId) return null;
  if (typeof teacherId === 'object' && teacherId.buffer) {
    const bytes = Object.values(teacherId.buffer) as number[];
    return Buffer.from(bytes).toString('hex');
  }
  return String(teacherId);
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Session expirée ou non autorisée' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    if (payload.role !== 'teacher') {
      return NextResponse.json({ message: 'Action réservée aux enseignants' }, { status: 403 });
    }

    const teacherId = extractTeacherId(payload);
    if (!teacherId) return NextResponse.json({ message: 'ID enseignant invalide' }, { status: 400 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const moduleId = formData.get('moduleId') as string | null;

    if (!file || !moduleId) {
      return NextResponse.json({ message: 'Données de transfert manquantes (Fichier ou Module ID)' }, { status: 400 });
    }

    // Vérification de propriété stricte basée sur l'ID normalisé du professeur
    const targetModule = await Module.findOne({ _id: moduleId, teacher: teacherId });
    if (!targetModule) {
      return NextResponse.json({ message: 'Module introuvable ou droits insuffisants' }, { status: 404 });
    }

    // Génération d'un nom de fichier standardisé propre
    const fileUrl = `/uploads/resources/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

    const newResource = {
      title: file.name,
      fileUrl: fileUrl,
      uploadedAt: new Date()
    };

    targetModule.resources.push(newResource);
    await targetModule.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Fichier enregistré et partagé avec succès',
      resource: newResource 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur upload document :", error);
    return NextResponse.json({ message: "Erreur interne pendant l'upload du document" }, { status: 500 });
  }
}