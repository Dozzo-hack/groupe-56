import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Class from '@/models/Class';
import Student from '@/models/Student';

// 1. Définition des interfaces strictes pour le Backend
interface BackendStudent {
  _id: any;
  name: string;
  matricule: string;
  email: string;
  phone?: string;
  location?: string;
  status: string;
  classCode: string;
}

interface BackendClass {
  name: string;
  classroom?: string;
  level: number;
  filiere?: string | { name?: string; nom?: string; title?: string };
}

interface StudentOutput {
  id: string;
  name: string;
  matricule: string;
  email: string;
  phone: string;
  location: string;
  pass: string;
  status: string;
}

interface ClassOutput {
  nom: string;
  classroom: string;
  students: StudentOutput[];
}

interface FiliereOutput {
  nom: string;
  classes: ClassOutput[];
}

interface NiveauMapValue {
  nom: string;
  rawLevel: number;
  filieres: { [filiereNom: string]: FiliereOutput };
}

export async function GET() {
  await dbConnect();
  try {
    // Récupération des données avec un typage fort (bye bye les 'any[]')
    const classesFromDb = (await Class.find({}).lean()) as unknown as BackendClass[];
    const studentsFromDb = (await Student.find({ status: 'active' }).lean()) as unknown as BackendStudent[];

    // Typage strict de l'accumulateur pour éviter le piège du type 'never'
    const hierarchyMap: { [niveauLabel: string]: NiveauMapValue } = {};

    const getLevelLabel = (level: number): string => {
      if (level <= 3) return `Niveau ${level}`;
      return `Master ${level - 3}`;
    };

    // 2. Structurer l'arbre
    classesFromDb.forEach((cls) => {
      const niveauLabel = getLevelLabel(cls.level);
      
      // Sécurité Filière : On extrait le nom proprement
      let filiereNom = "Tronc Commun";
      if (cls.filiere) {
        if (typeof cls.filiere === 'object' && cls.filiere !== null) {
          filiereNom = cls.filiere.name || cls.filiere.nom || cls.filiere.title || "Filière Spéciale";
        } else if (typeof cls.filiere === 'string') {
          filiereNom = cls.filiere;
        } else {
          filiereNom = String(cls.filiere);
        }
      }

      if (!hierarchyMap[niveauLabel]) {
        hierarchyMap[niveauLabel] = { 
          nom: niveauLabel, 
          rawLevel: cls.level, 
          filieres: {} 
        };
      }

      if (!hierarchyMap[niveauLabel].filieres[filiereNom]) {
        hierarchyMap[niveauLabel].filieres[filiereNom] = { 
          nom: filiereNom, 
          classes: [] 
        };
      }

      hierarchyMap[niveauLabel].filieres[filiereNom].classes.push({
        nom: cls.name,
        classroom: cls.classroom || "Sans Salle",
        students: []
      });
    });

    // 3. Ventiler les étudiants au bon endroit
    studentsFromDb.forEach((student) => {
      const studentId = student._id && typeof student._id === 'object' && 'toString' in student._id
        ? student._id.toString()
        : String(student._id);

      for (const niveau of Object.values(hierarchyMap)) {
        for (const filiere of Object.values(niveau.filieres)) {
          const targetClass = filiere.classes.find((c) => c.nom === student.classCode);
          if (targetClass) {
            targetClass.students.push({
              id: studentId,
              name: student.name,
              matricule: student.matricule,
              email: student.email,
              phone: student.phone || "Non renseigné",
              location: student.location || "N/A",
              pass: "•••••",
              status: student.status
            });
          }
        }
      }
    });

    // 4. Conversion finale en tableau trié
    const finalHierarchy = Object.values(hierarchyMap).map((niv) => ({
      nom: niv.nom,
      rawLevel: niv.rawLevel,
      filieres: Object.values(niv.filieres).map((fil) => ({
        nom: fil.nom,
        classes: fil.classes
      }))
    }));

    // Tri par niveau (du plus grand au plus petit)
    finalHierarchy.sort((a, b) => b.rawLevel - a.rawLevel);

    return NextResponse.json(finalHierarchy, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Erreur serveur dans la hiérarchie", error: error.message }, 
      { status: 500 }
    );
  }
}