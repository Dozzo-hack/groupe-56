import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/dbConnect';
import Progression from '@/models/Progression';
import * as jose from 'jose';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { moduleId, resourceId } = await request.json();
    
    // Récupération propre via Next.js cookies()
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
    
    // Décodage avec JOSE (comme le reste de ton application)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const studentId = String(payload.userId || payload.id);

    let progression = await Progression.findOne({ student: studentId, module: moduleId });

    if (!progression) {
      progression = new Progression({
        student: studentId,
        module: moduleId,
        viewedResources: [resourceId]
      });
    } else {
      if (!progression.viewedResources.includes(resourceId)) {
        progression.viewedResources.push(resourceId);
      }
    }

    await progression.save();
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error("Erreur toggle-view:", error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}