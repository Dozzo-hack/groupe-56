import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Attendance from '@/models/Attendance';
import Subject from '@/models/Subject';
import Student from '@/models/Student';
import dbConnect from '@/lib/dbConnect';
// L'import de Ticket/Request n'est pas nécessaire pour récupérer les présences

// 🎯 CORRECTION 1 : Le paramètre attendu par Next.js est de type 'Request' (Requête HTTP)
export async function GET(request: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value; 

    if (!token) {
      return NextResponse.json({ error: "Accès refusé. Token manquant." }, { status: 401 });
    }

    let payload;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
    } catch (err) {
      console.error("[JWT_VERIFY_ERROR]", err);
      return NextResponse.json({ error: "Session expirée ou token invalide." }, { status: 401 });
    }

    const studentId = payload.userId || payload.id || payload._id;

    if (!studentId) {
      return NextResponse.json({ error: "Identifiant introuvable dans le token." }, { status: 401 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ error: "Étudiant introuvable dans la base de données" }, { status: 404 });
    }

    const currentClassCode = student.classCode;
    const allClassSessions = await Attendance.find({ classCode: currentClassCode });
    const uniqueSubjectCodes = Array.from(new Set(allClassSessions.map(s => s.subjectCode)));

    let totalAbsences = 0;
    let totalSessionsChecked = 0;

    const modules = await Promise.all(uniqueSubjectCodes.map(async (code) => {
      const subjectInfo = await Subject.findOne({ code });
      const subjectSessions = allClassSessions.filter(s => s.subjectCode === code);

      let present = 0;
      let absent = 0;

      subjectSessions.forEach(session => {
        // 🎯 CORRECTION 2 : Ajout du type 'any' explicite pour la variable 'r'
        const myRecord = session.records.find((r: any) => r.studentId.toString() === studentId.toString());
        if (myRecord) {
          totalSessionsChecked++;
          if (myRecord.status === 'present') present++;
          else {
            absent++;
            totalAbsences++;
          }
        }
      });

      let status = 'Régulier';
      if (absent > 2) status = 'Attention';
      if (absent === 0 && present > 0) status = 'Parfait';

      return {
        subject: subjectInfo ? subjectInfo.name : code,
        totalClasses: subjectSessions.length,
        present,
        absent,
        status
      };
    }));

    const totalPresents = totalSessionsChecked - totalAbsences;
    const globalRateNum = totalSessionsChecked > 0 ? Math.round((totalPresents / totalSessionsChecked) * 100) : 100;

    return NextResponse.json({
      globalRate: `${globalRateNum}%`,
      totalAbsences,
      totalLates: 0, 
      modules
    }, { status: 200 });

  } catch (error) {
    console.error("[ATTENDANCE_API_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}