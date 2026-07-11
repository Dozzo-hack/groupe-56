import { NextResponse } from 'next/server';
import Module from '@/models/Module';
import { Grade } from '@/models/Grade';
// Si User n'est finalement pas utilisé directement dans ce fichier, tu peux commenter la ligne suivante :
import Student from '@/models/Student';

export async function GET(req: Request) {
  try {
    const teacherId = "ID_PROF_CONNECTE";
    // Récupérer les modules assignés au prof, incluant les élèves et leurs notes
    const modules = await Module.find({ teacherId }).populate('classId');
    
    // Format attendu par le front
    return NextResponse.json({ classes: [] }); 
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { moduleId, students, status } = await req.json();
    
    // Mise à jour massive des notes (Upsert)
    const updatePromises = students.map((student: any) => 
      Grade.findOneAndUpdate(
        { studentId: student.id, moduleId: moduleId },
        { value: parseFloat(student.note), status: status },
        { upsert: true, new: true }
      )
    );
    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}