import { NextResponse } from 'next/server';
import Attendance from '@/models/Attendance';
import Subject from '@/models/Subject';

export async function GET(
  request: Request, 
  { params }: { params: Promise<{ classId: string }> } // 1. Typer params comme une Promesse
) {
  try {
    const { classId } = await params; // 2. Extraire classId avec await

    // Trouver tous les appels liés à cette classe
    const logs = await Attendance.find({ classCode: classId });

    // Extraire les codes matières uniques concernés
    const uniqueSubjectCodes = Array.from(new Set(logs.map(l => l.subjectCode)));

    const subjectAnalysis = await Promise.all(uniqueSubjectCodes.map(async (code) => {
      const subjectInfo = await Subject.findOne({ code: code });
      const currentLogs = logs.filter(l => l.subjectCode === code);

      let hoursDone = currentLogs.length * 2; // Hypothèse professionnelle : 1 session d'appel = 2h de cours
      
      // Compter combien d'étudiants ont accumulé des absences
      const absenceMap: Record<string, number> = {};
      currentLogs.forEach(log => {
        log.records.forEach((rec: any) => {
          if (rec.status === 'absent') {
            absenceMap[rec.matricule] = (absenceMap[rec.matricule] || 0) + 1;
          }
        });
      });

      // 3. Récupérer non seulement le nombre, mais aussi les matricules des étudiants en alerte (plus de 2 absences)
      const alertStudents = Object.entries(absenceMap)
        .filter(([_, absCount]) => absCount > 2)
        .map(([matricule, count]) => ({ matricule, count }));

      return {
        subject: subjectInfo ? subjectInfo.name : code,
        hoursDone,
        alertCount: alertStudents.length,
        alertStudents // On renvoie la liste détaillée au frontend
      };
    }));

    return NextResponse.json(subjectAnalysis, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}