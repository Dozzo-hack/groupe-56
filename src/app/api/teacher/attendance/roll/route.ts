import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Student from '@/models/Student'; // Ajustez le chemin selon votre projet

export async function GET(request: Request) {
  try {
    // Connexion BDD (Assurez-vous d'avoir votre helper dbConnect() ici si nécessaire)
    const { searchParams } = new URL(request.url);
    const classCode = searchParams.get('classCode');

    if (!classCode) {
      return NextResponse.json({ error: "Code classe manquant" }, { status: 400 });
    }

    // Extraction des étudiants actifs liés à ce classCode spécifique
    const activeStudents = await Student.find({ 
      classCode: classCode, 
      status: 'active' 
    }).select('name matricule').sort({ name: 1 });

    // Formatage propre pour correspondre à l'interface Frontend
    const formattedRoll = activeStudents.map(student => ({
      id: student._id,
      name: student.name,
      matricule: student.matricule
    }));

    return NextResponse.json(formattedRoll, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}