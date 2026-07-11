import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const currentClassCode = params.id; // Ex: L1-GI-FI-A

  try {
    const students = await Student.find({ classCode: currentClassCode, status: 'active' });

    if (students.length === 0) {
      return NextResponse.json({ message: "Aucun étudiant actif trouvé dans cette classe." }, { status: 404 });
    }

    // Détermination de la classe supérieure suivante
    let nextClassCode = currentClassCode;
    if (currentClassCode.startsWith('L1')) nextClassCode = currentClassCode.replace('L1', 'L2');
    else if (currentClassCode.startsWith('L2')) nextClassCode = currentClassCode.replace('L2', 'L3');
    else if (currentClassCode.startsWith('L3')) nextClassCode = currentClassCode.replace('L3', 'M1');
    else if (currentClassCode.startsWith('M1')) nextClassCode = currentClassCode.replace('M1', 'M2');

    // Sauvegarde du parcours dans l'historique et mise à jour de la classe actuelle
    const currentYear = `${new Date().getFullYear() - 1}-${new Date().getFullYear()}`;

    await Student.updateMany(
      { classCode: currentClassCode, status: 'active' },
      {
        $async: true,
        $set: { classCode: nextClassCode },
        $push: { academicHistory: { classCode: currentClassCode, year: currentYear } }
      }
    );

    return NextResponse.json({ message: `Félicitations, la classe a été promue en ${nextClassCode} !` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Erreur lors de la promotion.", error: error.message }, { status: 500 });
  }
}