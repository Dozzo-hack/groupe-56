import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/dbConnect'; // Assure-toi d'avoir un fichier de connexion à MongoDB
import Ticket from '@/models/Ticket';
import '@/models/Student'; // Important pour que Mongoose connaisse le modèle lors du .populate()

export async function GET(request: Request) {
  try {
    // 1. Connexion à la base de données
    await dbConnect();

    // 2. Récupération du token depuis les cookies
    
    const cookieStore = await cookies();
const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Accès refusé. Aucun token fourni.' },
        { status: 401 }
      );
    }

    // 3. Vérification du token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    // 4. Contrôle de rôle strict (RBAC)
    const userRole = payload.role as string;
    if (userRole !== 'admin') {
      return NextResponse.json(
        { message: 'Accès interdit. Rôle Administrateur requis.' },
        { status: 403 }
      );
    }

    // 5. Récupération de tous les tickets avec les infos de l'étudiant
    // On sélectionne le nom et l'email de l'étudiant pour l'affichage dans le tableau admin
    const tickets = await Ticket.find({})
      .populate('student', 'name email') 
      .sort({ createdAt: -1 }); // Du plus récent au plus ancien

    return NextResponse.json(tickets, { status: 200 });

  } catch (error) {
    console.error('Erreur API Admin Tickets:', error);
    return NextResponse.json(
      { message: 'Une erreur interne est survenue ou le token est invalide.' },
      { status: 500 }
    );
  }
}