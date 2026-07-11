import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const result = await Student.updateMany(
      { classCode: params.id, status: 'active' },
      { $set: { status: 'graduated' } }
    );

    return NextResponse.json({ message: `${result.modifiedCount} étudiants ont été déclarés diplômés avec succès.` }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Erreur de traitement de diplomation.", error: error.message }, { status: 500 });
  }
}