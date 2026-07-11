import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import connectDB from '@/lib/dbConnect'; // Respect de ton import
import Schedule from '@/models/Schedule';
import Student from '@/models/Student';
import '@/models/Module'; 
import '@/models/Class'; // Assure-toi que ce fichier existe

export async function GET(req: Request) {
  try {
    // 1. Récupération et vérification du token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    // 🐛 DEBUG : Vérifie dans ton terminal VS Code que le payload contient bien l'email ou l'ID
    console.log("🔍 [DEBUG] Contenu du Token Étudiant :", payload);

    const studentId = payload.userId || payload.id;
    const studentEmail = payload.email as string;

    // 2. Connexion et recherche de l'étudiant
    await connectDB(); 
    
    let student = null;
    if (studentId) {
      student = await Student.findById(studentId);
    } else if (studentEmail) {
      student = await Student.findOne({ email: studentEmail });
    }
    
    if (!student) {
      console.error("❌ [ERREUR] Aucun étudiant trouvé pour l'ID/Email fourni.");
      return NextResponse.json({ error: "Profil étudiant introuvable" }, { status: 404 });
    }
    
    // 3. Récupération des cours
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const schedules = await Schedule.find({ 
      classId: student.classId, 
      date: { $gte: today } 
    })
    .populate('moduleId')
    .sort({ date: 1, startTime: 1 })
    .limit(5);

    return NextResponse.json({ schedules }, { status: 200 });

  } catch (error) {
    console.error("Erreur API Étudiant:", error);
    return NextResponse.json({ error: "Erreur serveur ou Token invalide" }, { status: 500 });
  }
}