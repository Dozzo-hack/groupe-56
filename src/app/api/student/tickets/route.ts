import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/dbConnect';
import Ticket from '@/models/Ticket';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// ==========================================
// 1. GET : Récupérer uniquement LES TICKETS
// ==========================================
export async function GET(request: Request) {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    if (payload.role !== 'student') {
      return NextResponse.json({ message: 'Accès interdit' }, { status: 403 });
    }

    const myTickets = await Ticket.find({ student: payload.userId }).sort({ createdAt: -1 });
    return NextResponse.json(myTickets, { status: 200 });
  } catch (error) {
    console.error('Erreur GET Tickets:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// ==========================================
// 2. POST : Créer un TICKET avec FICHIER
// ==========================================
export async function POST(request: Request) {
  try {
    await dbConnect();

    // 1. Vérification du token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    if (payload.role !== 'student') return NextResponse.json({ message: 'Accès interdit' }, { status: 403 });

    // 2. Récupération du FormData (PAS de JSON ici !)
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const file = formData.get('file') as File | null;

    if (!type || !description) {
      return NextResponse.json({ message: 'Le type et la description sont requis.' }, { status: 400 });
    }

    // 3. Gestion de l'upload du fichier (si présent)
    let attachmentUrl = "";
    let attachmentName = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Nom de fichier unique
      const uniqueFilename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Créer le dossier s'il n'existe pas
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

      const filepath = path.join(uploadDir, uniqueFilename);
      await writeFile(filepath, buffer);
      
      attachmentUrl = `/uploads/${uniqueFilename}`;
      attachmentName = file.name;
    }

    // 4. Sauvegarde en Base de données
    const newTicket = new Ticket({
      student: payload.userId,
      type,
      description,
      priority: 'medium', // par défaut
      attachmentName,
      attachmentUrl,
      status: 'pending'
    });

    await newTicket.save();

    return NextResponse.json({ message: 'Ticket créé avec succès !', ticket: newTicket }, { status: 201 });
  } catch (error) {
    console.error('Erreur POST Ticket:', error);
    return NextResponse.json({ message: 'Erreur lors de la création' }, { status: 500 });
  }
}