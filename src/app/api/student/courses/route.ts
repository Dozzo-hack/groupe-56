import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import Module from '@/models/Module';
import Progression from '@/models/Progression';
import * as jose from 'jose';
import mongoose from 'mongoose'; // 🔥 Important pour la validation de l'ObjectId

export async function GET() {
  await dbConnect();
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non autorisé. Session manquante.' }, { status: 401 });
    }

    // Décodage et vérification sécurisée du jeton JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    if (payload.role !== 'student') {
      return NextResponse.json({ message: 'Accès interdit. Réservé aux étudiants.' }, { status: 403 });
    }

    // Récupération sécurisée de l'ID de l'étudiant depuis le payload
    const studentId = String(payload.userId || payload.id || payload._id);

    // Récupération du profil complet en BD pour obtenir le 'classCode' en temps réel
    const student = await Student.findById(studentId).lean();
    
    if (!student) {
      return NextResponse.json({ message: 'Profil étudiant introuvable.' }, { status: 404 });
    }

    const studentClassCode = student.classCode;

    // Si l'étudiant n'a pas encore de classe affectée en base de données, on renvoie un tableau vide
    if (!studentClassCode) {
      return NextResponse.json([], { status: 200 });
    }

    // 🛡️ PROTECTION ANTI-CRASH : Construction dynamique des critères de recherche Mongoose
    const queryConditions: any[] = [];

    // 1. On cherche par chaîne de caractères brute (ex: "L1-GI-FI-A") sur le champ classCode
    queryConditions.push({ classCode: studentClassCode });

    // 2. On interroge le champ 'class' (qui attend un ObjectId) UNIQUEMENT si la valeur est au format 24h hex
    if (mongoose.Types.ObjectId.isValid(studentClassCode)) {
      queryConditions.push({ class: studentClassCode });
    }

    // 📚 Récupération sécurisée des modules correspondants aux critères sans risque de CastError
    const modules = await Module.find({ $or: queryConditions }).lean();

    // 🔄 Calcul des progressions individuelles de l'étudiant sur chaque cours trouvé
    const coursesWithProgression = await Promise.all(modules.map(async (mod: any) => {
      const prog = await Progression.findOne({ student: studentId, module: mod._id });
      const totalResources = mod.resources ? mod.resources.length : 0;
      const viewedCount = prog ? prog.viewedResources.length : 0;
      
      const percent = totalResources > 0 ? Math.round((viewedCount / totalResources) * 100) : 0;

      return {
        id: mod._id,
        code: mod.code || 'CODE',
        title: mod.title,
        teacherName: mod.teacherName || 'Enseignant',
        colorAccent: mod.colorAccent || 'blue',
        progression: percent,
        totalFiles: totalResources
      };
    }));

    // Envoi des données nettoyées et structurées au frontend
    return NextResponse.json(coursesWithProgression, { status: 200 });

  } catch (error: any) {
    console.error("Erreur GET cours étudiants :", error);
    return NextResponse.json({ message: 'Erreur serveur lors de la récupération des cours.' }, { status: 500 });
  }
}