import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Student from '@/models/Student';
import bcrypt from 'bcryptjs';
import * as XLSX from 'xlsx';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const classCode = formData.get('classCode') as string;

    if (!file || !classCode) {
      return NextResponse.json({ message: 'Fichier Excel ou code de classe manquant.' }, { status: 400 });
    }

    // Lecture du fichier binaire Excel
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Récupération de la première feuille de calcul
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Conversion en tableau d'objets JSON
    // Le fichier Excel doit contenir les colonnes : name, email, password, matricule, phone, location
    const excelData = XLSX.utils.sheet_to_json(worksheet) as any[];

    if (excelData.length === 0) {
      return NextResponse.json({ message: 'Le fichier Excel est vide.' }, { status: 400 });
    }

    const savedStudents = [];
    const errors = [];

    for (const row of excelData) {
      try {
        // Validation basique par ligne
        if (!row.name || !row.email || !row.password || !row.matricule) {
          errors.push(`Ligne sautée : Données manquantes pour ${row.name || 'Inconnu'}`);
          continue;
        }

        // Hachage sécurisé du mot de passe fourni dans l'Excel
        const hashedPassword = await bcrypt.hash(String(row.password), 10);

        const studentData = {
          name: row.name,
          email: String(row.email).toLowerCase().trim(),
          password: hashedPassword,
          matricule: String(row.matricule).trim(),
          phone: row.phone ? String(row.phone) : "",
          location: row.location ? String(row.location).toUpperCase() : "",
          classCode: classCode, // Injection automatique de la classe choisie dans le modal
        };

        // Utilisation d'un updateOne avec upsert pour éviter les plantages sur doublons d'emails/matricules
        await Student.updateOne(
          { $or: [{ email: studentData.email }, { matricule: studentData.matricule }] },
          { $setOnInsert: studentData },
          { upsert: true }
        );

        savedStudents.push(row.name);
      } catch (err: any) {
        errors.push(`Erreur sur l'étudiant ${row.name || ''}: ${err.message}`);
      }
    }

    return NextResponse.json({
      message: `${savedStudents.length} étudiants importés avec succès !`,
      errors: errors
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: 'Erreur lors du traitement du fichier.', error: error.message }, { status: 500 });
  }
}