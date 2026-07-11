import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import * as jose from 'jose';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

// 🛡️ CORRECTION : Pas de { params } ici, cette route n'est pas dynamique
export async function POST(request: Request) {
  await dbConnect();
  try {
    // 1. Authentification
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const studentId = String(payload.id || payload.userId || '');

    if (!studentId) {
      return NextResponse.json({ message: 'Identifiant étudiant introuvable.' }, { status: 401 });
    }

    // 2. Extraction stricte depuis le formulaire (pas de params)
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const moduleId = formData.get('moduleId') as string | null;
    const assignmentId = formData.get('assignmentId') as string | null;

    if (!file || !moduleId) {
      return NextResponse.json({ message: 'Fichier ou ID du module manquant.' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
      return NextResponse.json({ message: 'ID de module invalide.' }, { status: 400 });
    }

    // 3. Sauvegarde physique
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'submissions');
    await mkdir(uploadDir, { recursive: true });

    const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueFileName = `${Date.now()}-${safeFileName}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/submissions/${uniqueFileName}`;

    // 4. Gestion du dépôt libre ou assigné
    const isValidAssignmentId = mongoose.Types.ObjectId.isValid(assignmentId || "");
    const finalAssignmentId = isValidAssignmentId ? assignmentId : null;

    const submissionData: any = {
      student: studentId,
      module: moduleId,
      fileUrl
    };

    if (finalAssignmentId) {
      submissionData.assignmentId = finalAssignmentId;
    }

    const newSubmission = await Submission.create(submissionData);

    return NextResponse.json({ 
      success: true, 
      message: 'Votre devoir a été transmis avec succès !',
      submission: newSubmission 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Erreur lors du dépôt de devoir :", error);
    return NextResponse.json({ message: 'Erreur lors du dépôt', error: error.message }, { status: 500 });
  }
}