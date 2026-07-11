import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Class from '@/models/Class';
import jwt from 'jsonwebtoken';

// Fonction de vérification asynchrone compatible Next.js 15+
async function checkAdminOrThrow() {
  const cookieStore = await cookies(); // Déballage de la promesse des cookies
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

export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> } // Adapté à Next.js 15 asynchrone
) {
  await dbConnect();
  try {
    // 1. Vérification stricte de la session Administrateur via les cookies
    await checkAdminOrThrow();

    // 2. Déballage asynchrone des paramètres d'URL (obligatoire sur Next.js 15)
    const { id } = await params;

    // 3. Suppression dans MongoDB
    const deletedClass = await Class.findByIdAndDelete(id);
    
    if (!deletedClass) {
      return NextResponse.json({ message: 'Cette classe n\'existe pas ou a déjà été supprimée.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Classe supprimée avec succès.' }, { status: 200 });
  } catch (error: any) {
    if (error.status) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ message: 'Erreur serveur lors de la suppression.' }, { status: 500 });
  }
}