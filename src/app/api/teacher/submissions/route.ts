import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Submission from '@/models/Submission';
import Student from '@/models/Student';

export async function GET(request: Request) {
  await dbConnect();
  try {
    // Récupération sécurisée du paramètre dans l'URL
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (!moduleId) {
      return NextResponse.json({ message: 'L\'ID du module est requis.' }, { status: 400 });
    }

    // Récupération des devoirs liés à ce module précis
    const submissions = await Submission.find({ module: moduleId })
      // Peuple les infos de l'étudiant si ton modèle Submission a une ref vers User/Student
      .populate('student', 'name email matricule classCode') 
      .sort({ createdAt: -1 });

    return NextResponse.json(submissions, { status: 200 });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des devoirs :", error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}