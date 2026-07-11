import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Module from '@/models/Module';
import Class from '@/models/Class';
import Subject from '@/models/Subject';
import * as jose from 'jose';

function extractTeacherId(payload: any): string | null {
  let teacherId = payload.id || payload.userId;
  if (!teacherId) return null;
  if (typeof teacherId === 'object' && teacherId.buffer) {
    const bytes = Object.values(teacherId.buffer) as number[];
    return Buffer.from(bytes).toString('hex');
  }
  return String(teacherId);
}

// GET : Récupérer les modules de l'enseignant connecté
export async function GET() {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    if (payload.role !== 'teacher') {
      return NextResponse.json({ message: 'Accès interdit.' }, { status: 403 });
    }

    const teacherId = extractTeacherId(payload);
    if (!teacherId) return NextResponse.json({ message: 'ID enseignant introuvable' }, { status: 400 });

    const modules = await Module.find({ teacher: teacherId })
      .populate({ path: 'class', options: { strictPopulate: false } })
      .populate({ path: 'subject', options: { strictPopulate: false } })
      .lean();

    return NextResponse.json(modules, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Erreur serveur', error: error.message }, { status: 500 });
  }
}

// POST : Assigner une matière (un module) à une classe précise
export async function POST(request: Request) {
  await dbConnect();
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    if (payload.role !== 'teacher') {
      return NextResponse.json({ message: 'Accès interdit.' }, { status: 403 });
    }

    const teacherId = extractTeacherId(payload);
    if (!teacherId) return NextResponse.json({ message: 'ID enseignant introuvable' }, { status: 400 });

    const { classId, subjectId, colorAccent, title, level, teacherName } = await request.json();

    if (!classId || !subjectId) {
      return NextResponse.json({ message: 'La classe et la matière sont obligatoires.' }, { status: 400 });
    }

    // Récupération des données maîtres pour sécuriser les codes et libellés
    const [foundClass, foundSubject] = await Promise.all([
      Class.findById(classId),
      Subject.findById(subjectId)
    ]);

    if (!foundClass || !foundSubject) {
      return NextResponse.json({ message: 'Classe ou Matière introuvable.' }, { status: 404 });
    }

    // Le nom de la classe (ex: "M1-GL" ou "L1-INFO") sert de classCode de cloisonnement
    const classCode = foundClass.name || foundClass.code; 
    const finalTitle = title || foundSubject.name;
    const finalLevel = level || foundClass.level;
    const finalTeacherName = teacherName || payload.name || "Enseignant";

    // Vérification anti-doublon
    const existingModule = await Module.findOne({ class: classId, subject: subjectId, teacher: teacherId });
    if (existingModule) {
      return NextResponse.json({ message: 'Vous avez déjà activé cette matière pour cette classe.' }, { status: 400 });
    }

    const code = `mod-${Math.floor(1000 + Math.random() * 9000)}`;

    const newModule = new Module({
      class: classId,
      classCode, 
      subject: subjectId,
      code,
      teacher: teacherId,
      teacherName: finalTeacherName,
      level: finalLevel,
      title: finalTitle,
      colorAccent: colorAccent || 'blue',
      resources: []
    });

    await newModule.save();
    return NextResponse.json(newModule, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: 'Impossible de créer le module', error: error.message }, { status: 500 });
  }
}