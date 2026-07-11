import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import Attendance from '@/models/Attendance';
import Teacher from '@/models/Teacher';
import dbConnect from '@/lib/dbConnect';

export async function POST(request: Request) {
  try {
    await dbConnect();

    // 1. SÉCURITÉ : Récupération de l'identité de l'enseignant via son token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Accès refusé. Token manquant." }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const teacherId = payload.userId || payload.id || payload._id;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({ error: "Enseignant introuvable." }, { status: 404 });
    }

    // 2. Traitement de la requête
    const body = await request.json();
    const { classCode, subjectCode, roll } = body;

    if (!classCode || !subjectCode || !roll || !Array.isArray(roll)) {
      return NextResponse.json(
        { error: "Données requises manquantes (classCode, subjectCode, roll)" }, 
        { status: 400 }
      );
    }

    const records = roll.map((student: any) => ({
      studentId: student.id,
      studentName: student.name,
      matricule: student.matricule,
      status: student.status // 'present' ou 'absent'
    }));

    // 3. Enregistrement en base de données
    const newAttendance = await Attendance.create({
      classCode,
      subjectCode,
      teacherEmail: teacher.email, // On utilise l'email sécurisé extrait de la base
      date: new Date(),
      records
    });

    return NextResponse.json({ success: true, id: newAttendance._id }, { status: 201 });
  } catch (error: any) {
    console.error("[ATTENDANCE_SAVE_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne lors de la sauvegarde." }, { status: 500 });
  }
}