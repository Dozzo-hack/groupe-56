import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';
import Teacher from '@/models/Teacher';
import Student from '@/models/Student';
import bcrypt from 'bcryptjs';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ message: "Interdit" }, { status: 403 });
  }

  try {
    await dbConnect();

    // On nettoie les 3 collections pour repartir à zéro
    await Admin.deleteMany({});
    await Teacher.deleteMany({});
    await Student.deleteMany({});

    // Mots de passe hautement sécurisés et hachés
    const hashedPass = await bcrypt.hash('DutPassword2026!', 12);

    // 1. Création de l'admin principal
    await Admin.create({
      name: "Super Administrateur IUT",
      email: "admin@iut.fr",
      password: hashedPass
    });

    // 2. Création d'un enseignant
    await Teacher.create({
      name: "Pr. Albert",
      email: "teacher@iut.fr",
      password: hashedPass,
      modules: ["Développement Web", "Sécurité Réseau"]
    });

    // 3. Création d'un étudiant
    await Student.create({
      name: "Marc Duboi",
      email: "student@iut.fr",
      password: hashedPass,
      ine: "1234567890X"
    });

    return NextResponse.json({ 
      success: true, 
      message: "🔒 Les 3 collections (Admin, Teacher, Student) ont été initialisées avec succès !" 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}