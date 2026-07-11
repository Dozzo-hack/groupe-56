import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import dbConnect from '@/lib/dbConnect';
import Ticket from '@/models/Ticket';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    // Vérification stricte du rôle admin
    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Accès interdit' }, { status: 403 });
    }

    // Récupération des données du formulaire (FormData car il peut y avoir un fichier)
    const formData = await request.formData();
    const ticketId = formData.get('ticketId') as string;
    const text = formData.get('text') as string;
    const resolve = formData.get('resolve') === 'true'; // booléen pour savoir si on clôture
    const file = formData.get('file') as File | null;

    if (!ticketId) {
      return NextResponse.json({ message: 'ID du ticket manquant' }, { status: 400 });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return NextResponse.json({ message: 'Ticket introuvable' }, { status: 404 });
    }

    // Gestion de l'upload du fichier de l'admin (si présent)
    let fileUrl = "";
    let fileName = "";

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uniqueFilename = `admin-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

      const filepath = path.join(uploadDir, uniqueFilename);
      await writeFile(filepath, buffer);
      
      fileUrl = `/uploads/${uniqueFilename}`;
      fileName = file.name;
    }

    // Ajout du message dans l'historique du ticket
    ticket.messages.push({
      sender: 'admin',
      text: text || (resolve ? "Votre dossier a été traité et validé." : ""),
      fileName,
      fileUrl
    });

    // Si on a cliqué sur "Résoudre & Clôturer"
    if (resolve) {
      ticket.status = 'resolved';
    }

    await ticket.save();

    return NextResponse.json({ message: 'Réponse envoyée avec succès', ticket }, { status: 200 });

  } catch (error) {
    console.error("Erreur API Admin Reply:", error);
    return NextResponse.json({ message: 'Erreur serveur lors de la réponse' }, { status: 500 });
  }
}