import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import * as jose from 'jose';

// Importation de tes modèles Mongoose
import Student from '@/models/Student'; 
import Teacher from '@/models/Teacher';
import Admin from '@/models/Admin';

/**
 * 🔄 GET : Récupérer le profil de l'utilisateur connecté avec sa classe
 */
export async function GET() {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non autorisé. Session absente.' }, { status: 401 });
    }

    // Décodage du Token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    // Extraction propre de l'ID utilisateur
    const userId = String(payload.userId || payload.id || '');
    const role = payload.role;

    if (!userId || userId === '[object Object]') {
      return NextResponse.json({ message: 'Session corrompue. Veuillez vous reconnecter.' }, { status: 400 });
    }

    let userData = null;

    if (role === 'student') {
      // 🔥 Remplacement de 'class' par 'classCode' avec sécurité stricte désactivée au cas où
      userData = await Student.findById(userId)
        .select('-password')
        .populate({ path: 'classCode', strictPopulate: false })
        .lean();
    } else if (role === 'teacher') {
      userData = await Teacher.findById(userId).select('-password').lean();
    } else if (role === 'admin') {
      userData = await Admin.findById(userId).select('-password').lean();
    }

    if (!userData) {
      return NextResponse.json({ message: 'Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({
      authenticated: true,
      role,
      user: userData
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur GET /api/auth/profile :", error);
    return NextResponse.json({ message: 'Erreur interne du serveur.' }, { status: 500 });
  }
}

/**
 * 💾 PUT : Sauvegarder les modifications en Base de Données
 */
export async function PUT(req: Request) {
  await dbConnect();

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Non autorisé.' }, { status: 401 });
    }

    // Décodage du Token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const userId = String(payload.userId || payload.id || '');
    const role = payload.role;

    if (!userId || userId === '[object Object]') {
      return NextResponse.json({ message: 'Identifiant utilisateur invalide.' }, { status: 400 });
    }

    const body = await req.json();

    // 🔒 Extraction des champs autorisés pour la modification
    const { phone, residence, address, city, specialization, avatar, birthDate } = body;

    let updatedUser = null;

    // Mise à jour ciblée selon le rôle
    if (role === 'student') {
      const updateFields: any = {};
      if (phone !== undefined) updateFields.phone = phone;
      if (address !== undefined) updateFields.address = address;
      if (residence !== undefined) updateFields.residence = residence;
      if (city !== undefined) updateFields.city = city;
      if (avatar !== undefined) updateFields.avatar = avatar;
      if (birthDate !== undefined) updateFields.birthDate = birthDate;

      // 🔥 Exécution de la modification en Base de Données
      updatedUser = await Student.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true } // "new: true" renvoie le profil mis à jour
      )
      .select('-password')
      .populate({ path: 'classCode', strictPopulate: false });

    } else if (role === 'teacher') {
      const updateFields: any = {};
      if (phone !== undefined) updateFields.phone = phone;
      if (residence !== undefined) updateFields.residence = residence;
      if (specialization !== undefined) updateFields.specialization = specialization;
      if (avatar !== undefined) updateFields.avatar = avatar;
      if (birthDate !== undefined) updateFields.birthDate = birthDate;

      // 🔥 Exécution de la modification en Base de Données
      updatedUser = await Teacher.findByIdAndUpdate(
        userId,
        { $set: updateFields },
        { new: true, runValidators: true }
      ).select('-password');
    }

    if (!updatedUser) {
      return NextResponse.json({ message: 'Impossible de mettre à jour. Utilisateur introuvable.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour et sauvegardé en base de données avec succès.',
      user: updatedUser
    }, { status: 200 });

  } catch (error: any) {
    console.error("Erreur PUT /api/auth/profile :", error);
    return NextResponse.json({ message: 'Erreur lors de la sauvegarde des données.' }, { status: 500 });
  }
}