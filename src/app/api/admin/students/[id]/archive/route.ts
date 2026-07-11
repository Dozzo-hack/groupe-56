import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';

export async function PATCH(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    // Résolution de la promesse params pour Next.js 15
    const { id } = await params;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: { status: 'archived' } },
      { returnDocument: 'after' } // Correction du Warning Mongoose
    );

    if (!updatedStudent) {
      return NextResponse.json({ message: "Étudiant introuvable" }, { status: 404 });
    }

    return NextResponse.json({ message: "Le parcours de l'étudiant a été archivé." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Erreur d'archivage.", error: error.message }, { status: 500 });
  }
}