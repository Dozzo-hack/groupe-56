import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Subject from '@/models/Subject';
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

// Récupérer les matières (Accessible par Admin & Teachers)
export async function GET() {
  await dbConnect();
  try {
    // Changement de la barrière de contrôle ici aussi
    await checkAdminOrTeacherOrThrow();
    
    const subjects = await Subject.find({}).sort({ filiere: 1, level: 1 }).lean();
    return NextResponse.json(subjects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Erreur' }, 
      { status: error.status || 500 }
    );
  }
}

// Enregistrer une matière (Strictement Admin)
export async function POST(request: Request) {
  await dbConnect();
  try {
    await checkAdminOrThrow();
    
    const { name, code, filiere, level } = await request.json();
    
    if (!name || !code || !filiere || !level) {
      return NextResponse.json({ message: 'Champs manquants.' }, { status: 400 });
    }

    const newSubject = new Subject({ 
      name: name.trim(), 
      code: code.trim().toUpperCase(), 
      filiere: filiere.trim(), 
      level 
    });
    
    await newSubject.save();
    return NextResponse.json(newSubject, { status: 201 });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Code matière déjà utilisé.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}