import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  try {
    const { id } = await params; // Résolution de la promesse params

    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "Étudiant introuvable." }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Étudiant retiré avec succès." }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Erreur lors de la suppression.", error: error.message }, { status: 500 });
  }
}