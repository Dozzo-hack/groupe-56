import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Class from '@/models/Class';
import jwt from 'jsonwebtoken';

// 🔒 Sécurité stricte pour la création (Admin uniquement)
async function checkAdminOrThrow() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    const error: any = new Error('Non autorisé : Aucun token trouvé');
    error.status = 401;
    throw error;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'admin') {
      const error: any = new Error('Interdit : Droits administrateur requis');
      error.status = 403;
      throw error;
    }
    return decoded;
  } catch (err: any) {
    if (err.status) throw err;
    const error: any = new Error('Non autorisé : Token invalide ou expiré');
    error.status = 401;
    throw error;
  }
}

// 🔓 Sécurité souple pour la lecture (Admin ET Enseignants autorisés)
async function checkAdminOrTeacherOrThrow() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    const error: any = new Error('Non autorisé : Aucun token trouvé');
    error.status = 401;
    throw error;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    if (decoded.role !== 'admin' && decoded.role !== 'teacher') {
      const error: any = new Error('Interdit : Accès réservé à l’administration ou aux enseignants');
      error.status = 403;
      throw error;
    }
    return decoded;
  } catch (err: any) {
    if (err.status) throw err;
    const error: any = new Error('Non autorisé : Token invalide ou expiré');
    error.status = 401;
    throw error;
  }
}

// Récupérer les classes brutes (Utile pour le select de l'importation)
export async function GET() {
  await dbConnect();
  try {
    await checkAdminOrTeacherOrThrow();
    const classes = await Class.find({}).sort({ level: 1, filiere: 1, group: 1 }).lean();
    return NextResponse.json(classes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Erreur serveur' }, 
      { status: error.status || 500 }
    );
  }
}

// Créer une classe (Strictement Admin)
export async function POST(request: Request) {
  await dbConnect();
  try {
    await checkAdminOrThrow();

    const { regime, level, filiere, group, classroom } = await request.json();

    if (!regime || !level || !filiere || !group || !classroom) {
      return NextResponse.json({ message: 'Tous les champs sont obligatoires.' }, { status: 400 });
    }

    const prefix = level <= 3 ? `L${level}` : `M${level - 3}`;
    const cleanFiliere = filiere.trim().split(' ').map((w: string) => w[0]).join('').toUpperCase(); 
    const name = `${prefix}-${cleanFiliere}-${regime}-${group.trim().toUpperCase()}`;

    const newClass = new Class({ 
      name, 
      regime, 
      level, 
      filiere: filiere.trim(), 
      group: group.trim().toUpperCase(), 
      classroom: classroom.trim() 
    });
    
    await newClass.save();
    return NextResponse.json(newClass, { status: 201 });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Cette classe existe déjà dans le système.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Erreur lors de la création de la classe.' }, { status: 500 });
  }
}