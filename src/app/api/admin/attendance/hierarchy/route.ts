import { NextResponse } from 'next/server';
import Class from '@/models/Class';
import Student from '@/models/Student';
import Attendance from '@/models/Attendance';

export async function GET() {
  try {
    // 1. Récupérer toutes les classes configurées
    const classes = await Class.find({});
    
    // 2. Calculer le taux de présence pour chaque classe
    const detailedClasses = await Promise.all(classes.map(async (cls) => {
      const totalStudents = await Student.countDocuments({ classCode: cls.name, status: 'active' });
      
      // Agrégation des présences pour cette classe précise
      const attendanceLogs = await Attendance.find({ classCode: cls.name });
      
      let totalPresents = 0;
      let totalRecords = 0;

      attendanceLogs.forEach(log => {
        log.records.forEach((rec: any) => {
          totalRecords++;
          if (rec.status === 'present') totalPresents++;
        });
      });

      const avgRateNum = totalRecords > 0 ? Math.round((totalPresents / totalRecords) * 100) : 100;
      const avgAttendance = `${avgRateNum}%`;
      
      let status: 'Excellent' | 'Normal' | 'Alerte' = 'Normal';
      if (avgRateNum >= 90) status = 'Excellent';
      if (avgRateNum < 75) status = 'Alerte';

      return {
        id: cls.name,
        nom: cls.name,
        classroom: cls.classroom,
        totalStudents,
        avgAttendance,
        status,
        filiere: cls.filiere,
        level: cls.level
      };
    }));

    // 3. Structurer en arbre hiérarchique (Niveau > Filières > Classes)
    const hierarchy: any[] = [];

    detailedClasses.forEach(cls => {
      const niveauNom = `Niveau ${cls.level}`;
      
      let niveau = hierarchy.find(n => n.nom === niveauNom);
      if (!niveau) {
        niveau = { nom: niveauNom, filieres: [] };
        hierarchy.push(niveau);
      }

      let filiere = niveau.filieres.find((f: any) => f.nom === cls.filiere);
      if (!filiere) {
        filiere = { nom: cls.filiere, classes: [] };
        niveau.filieres.push(filiere);
      }

      filiere.classes.push({
        id: cls.id,
        nom: cls.nom,
        classroom: cls.classroom,
        totalStudents: cls.totalStudents,
        avgAttendance: cls.avgAttendance,
        status: cls.status
      });
    });

    // Tri de l'arborescence par Niveau (1 à 5)
    hierarchy.sort((a, b) => a.nom.localeCompare(b.nom));

    return NextResponse.json(hierarchy, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}