import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Admin from '@/models/Admin';
import Teacher from '@/models/Teacher';
import Student from '@/models/Student';
import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, role } = body;

    // 1. Protection contre les injections & validations de base
    if (typeof email !== 'string' || typeof password !== 'string' || typeof role !== 'string') {
      return NextResponse.json({ message: "Format des données invalide." }, { status: 400 });
    }

    let user = null;
    let redirectUrl = '';
    const cleanEmail = email.toLowerCase().trim();

    // 2. Sélection dynamique du modèle ET définition de la redirection
    if (role === 'admin') {
      user = await Admin.findOne({ email: cleanEmail });
      redirectUrl = '/admin-dashboard'; 
    } else if (role === 'teacher') {
      user = await Teacher.findOne({ email: cleanEmail });
      redirectUrl = '/teacher-dashboard'; 
    } else if (role === 'student') {
      user = await Student.findOne({ email: cleanEmail });
      redirectUrl = '/dashboard'; 
    } else {
      return NextResponse.json({ message: "Portail de connexion invalide." }, { status: 400 });
    }

    // 3. Vérification si l'utilisateur existe
    if (!user) {
      return NextResponse.json({ message: "Identifiants incorrects ou utilisateur introuvable sur ce portail." }, { status: 401 });
    }

    // 4. Barrière de sécurité stricte : vérification croisée du rôle
    if (user.role !== role) {
      return NextResponse.json({ message: "Accès refusé. Vous n'avez pas les droits pour utiliser ce portail." }, { status: 403 });
    }

    // 5. Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Identifiants incorrects." }, { status: 401 });
    }

    // 6. Génération du Token JWT avec conversion de l'ID en String 🔥
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new jose.SignJWT({ 
      userId: user._id.toString(), // 🎯 Correction ici : évite le bug [object Object]
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    // 7. Stockage du jeton dans un Cookie HTTP-Only
    const cookieStore = await cookies();
    cookieStore.set('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 60 * 60 * 24, // 1 jour
      path: '/',
    });

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl,
      user: { name: user.name, role: user.role, email: user.email }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur d'authentification :", error);
    return NextResponse.json({ message: "Erreur interne du serveur lors de la connexion." }, { status: 500 });
  }
}