import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/dbConnect';
import Schedule from '@/models/Schedule';
import Teacher from '@/models/Teacher';
import Student from '@/models/Student'; 
import '@/models/Module';
import '@/models/Class'; 

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // 🐛 LIGNE DE DEBUG : Regarde ton terminal VS Code après avoir rafraîchi la page !
    console.log("🔍 [DEBUG] Contenu du Token Professeur :", payload);

    // Extraction robuste (couvre tous les cas selon comment tu as créé ton token)
    const teacherId = payload.userId || payload.id || payload._id;
    const teacherEmail = payload.email as string;

    await connectDB();

    // Recherche d'abord par ID, puis par Email si l'ID n'est pas dans le token
    let teacher = null;
    if (teacherId) {
      teacher = await Teacher.findById(teacherId);
    } else if (teacherEmail) {
      teacher = await Teacher.findOne({ email: teacherEmail });
    }
    
    if (!teacher) {
      console.error("❌ [ERREUR] Aucun prof trouvé pour ID:", teacherId, "ou Email:", teacherEmail);
      return NextResponse.json({ error: "Profil professeur introuvable dans la BDD" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedules = await Schedule.find({ 
      teacherId: teacher._id, 
      date: { $gte: today } 
    })
    .populate('classId')
    .populate('moduleId')
    .sort({ date: 1, startTime: 1 })
    .limit(3);

    const totalStudents = await Student.countDocuments(); 
    const pendingGrades = 0; 

    return NextResponse.json({ 
      schedules,
      stats: {
        totalStudents,
        pendingGrades
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur API Teacher:", error);
    return NextResponse.json({ error: "Erreur serveur ou Token invalide" }, { status: 500 });
  }
}