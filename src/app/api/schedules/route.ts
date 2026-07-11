import { NextResponse } from 'next/server';
import Class from '@/models/Class';
import Module from '@/models/Module';
import Schedule from '@/models/Schedule';
// Assure-toi que la connexion DB est initialisée ici dans ton projet réel (ex: await connectDB();)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    // Si pas de classId, on renvoie les données pour le formulaire (Classes + Modules)
    if (!classId) {
      const classes = await Class.find().sort({ level: 1, name: 1 });
      const modules = await Module.find();
      return NextResponse.json({ classes, modules }, { status: 200 });
    }

    // Si on a un classId, on renvoie l'emploi du temps de cette classe précise
    const schedules = await Schedule.find({ classId })
      .populate('moduleId')
      .sort({ date: 1, startTime: 1 });
    
    return NextResponse.json(schedules, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classId, moduleId, date, startTime, endTime, room } = body;

    // Récupérer le module pour extraire le prof automatiquement côté serveur par sécurité
    const moduleInfo = await Module.findById(moduleId);
    if (!moduleInfo) return NextResponse.json({ error: "Module introuvable" }, { status: 404 });

    // Déterminer le jour de la semaine en français
    const dateObj = new Date(date);
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const dayName = days[dateObj.getDay()];

    const newSchedule = await Schedule.create({
      classId,
      moduleId,
      teacherId: moduleInfo.teacher,
      teacherName: moduleInfo.teacherName,
      date,
      day: dayName,
      startTime,
      endTime,
      room
    });

    return NextResponse.json(newSchedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la programmation" }, { status: 500 });
  }
}