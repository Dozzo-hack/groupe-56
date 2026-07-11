import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';
import Submission from '@/models/Submission';
import Progression from '@/models/Progression';
import * as jose from 'jose';

// 🔥 Typage mis à jour : params est maintenant une Promise<{ id: string }>
export async function GET(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    // Extraction sécurisée de l'ID de l'étudiant
    const studentId = String(payload.userId || payload.id || '');

    // 🎯 CORRECTION ICI : On attend (await) la résolution de params avant d'extraire l'id
    const resolvedParams = await params;
    const moduleId = resolvedParams.id;

    // Recherche du module en base de données
    const mod = await Module.findById(moduleId).lean() as any;
    if (!mod) return NextResponse.json({ message: 'Cours introuvable' }, { status: 404 });

    const prog = await Progression.findOne({ student: studentId, module: moduleId }).lean();
    const viewedResources = prog ? prog.viewedResources : [];

    // Formater les supports de cours
    const resources = (mod.resources || []).map((res: any, idx: number) => ({
      id: res._id?.toString() || String(idx),
      title: res.title,
      fileUrl: res.fileUrl, // 🎯 L'URL est maintenant transmise au frontend
      type: (res.fileUrl || '').endsWith('.pdf') ? 'PDF' : 'DOCUMENT',
      // Vérification robuste de la lecture
      viewed: viewedResources.some((v: any) => v.toString() === res._id?.toString()) 
    }));

    // Gérer l'espace devoir (Prendre le dernier devoir actif s'il y en a un)
    let assignment = null;
    if (mod.assignments && mod.assignments.length > 0) {
      const latestAssignment = mod.assignments[mod.assignments.length - 1];
      
      const existingSubmission = await Submission.findOne({
        student: studentId,
        module: moduleId,
        assignmentId: latestAssignment._id
      });

      assignment = {
        id: latestAssignment._id.toString(),
        title: latestAssignment.title,
        deadline: latestAssignment.deadline,
        hasSubmitted: !!existingSubmission
      };
    }

    return NextResponse.json({
      title: mod.title,
      teacherName: mod.teacherName,
      level: `Niveau ${mod.level || 1}`,
      resources,
      assignment
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur serveur détails cours :", error);
    return NextResponse.json({ message: 'Erreur serveur', error: error.message }, { status: 500 });
  }
}