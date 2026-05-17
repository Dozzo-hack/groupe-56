"use client";

import React, { useState } from 'react';
import { 
  ChevronRight, ChevronDown, GraduationCap, BookOpen, Users, 
  Save, FileSpreadsheet, ArrowLeft, Upload, LayoutGrid, CheckCircle2, Search
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminGradesFull() {
  const [view, setView] = useState<'hierarchy' | 'matrix'>('hierarchy');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [expandedNiveau, setExpandedNiveau] = useState<string | null>(null);
  const [expandedFiliere, setExpandedFiliere] = useState<string | null>(null);

  // --- STRUCTURE COMPLÈTE (NIVEAUX 1, 2, 3) ---
  const [campus, setCampus] = useState([
    {
      nom: "Niveau 3",
      filieres: [
        { 
          nom: "Génie Logiciel", 
          classes: [
            { 
              nom: "GL-A", 
              subjects: ["Algorithmique", "Réseaux", "Maths", "React"], 
              students: [
                { id: 1, name: "Jean Dupont", matricule: "4402", grades: { "Algorithmique": 0, "Réseaux": 0, "Maths": 0, "React": 0 } },
                { id: 2, name: "Marie Sali", matricule: "1289", grades: { "Algorithmique": 0, "Réseaux": 0, "Maths": 0, "React": 0 } }
              ] 
            },
            { nom: "GL-B", subjects: ["Algorithmique", "Réseaux", "Maths", "React"], students: [] }
          ] 
        }
      ]
    },
    {
      nom: "Niveau 2",
      filieres: [
        { 
          nom: "Systèmes Numériques", 
          classes: [
            { nom: "SN-2A", subjects: ["Électronique", "C++", "Signaux"], students: [] },
            { nom: "SN-2B", subjects: ["Électronique", "C++", "Signaux"], students: [] }
          ] 
        }
      ]
    },
    {
      nom: "Niveau 1",
      filieres: [
        { 
          nom: "Tronc Commun", 
          classes: [
            { nom: "TC-1", subjects: ["Physique", "Algèbre", "Anglais"], students: [] }
          ] 
        }
      ]
    }
  ]);

  // --- LOGIQUE D'IMPORTATION ---
  const handleImportGrades = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedClass) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const excelData: any[] = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        
        const updatedStudents = selectedClass.students.map((student: any) => {
          const row = excelData.find(r => r.Matricule?.toString() === student.matricule.toString());
          if (row) {
            const newGrades = { ...student.grades };
            selectedClass.subjects.forEach((sub: string) => {
              if (row[sub] !== undefined) newGrades[sub] = row[sub];
            });
            return { ...student, grades: newGrades };
          }
          return student;
        });

        setSelectedClass({ ...selectedClass, students: updatedStudents });
      };
      reader.readAsBinaryString(file);
    }
  };

  const updateGradeManually = (studentId: number, subject: string, value: string) => {
    const val = parseFloat(value) || 0;
    const updatedStudents = selectedClass.students.map((s: any) => 
      s.id === studentId ? { ...s, grades: { ...s.grades, [subject]: val } } : s
    );
    setSelectedClass({ ...selectedClass, students: updatedStudents });
  };

  // --- VUE 1 : GRILLE DE SAISIE (MATRIX) ---
  if (view === 'matrix' && selectedClass) {
    return (
      <div className="p-8 space-y-6 animate-in slide-in-from-right duration-500">
        <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
          <button onClick={() => setView('hierarchy')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black px-4 py-2 transition-all">
            <ArrowLeft size={20} /> Retour aux niveaux
          </button>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-black cursor-pointer hover:bg-indigo-100 transition-all border border-indigo-100">
              <Upload size={18} /> Importer XLSX
              <input type="file" className="hidden" accept=".xlsx" onChange={handleImportGrades} />
            </label>
            <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
              <Save size={18} /> Sauvegarder les notes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-8 font-black uppercase text-[11px] text-slate-400 tracking-[0.2em] sticky left-0 bg-slate-50">Étudiant</th>
                {selectedClass.subjects.map((sub: string) => (
                  <th key={sub} className="p-8 font-black uppercase text-[11px] text-slate-400 tracking-[0.2em] text-center">{sub}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {selectedClass.students.map((st: any) => (
                <tr key={st.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="p-8 sticky left-0 bg-white shadow-[10px_0_15px_-10px_rgba(0,0,0,0.05)]">
                    <p className="font-black text-slate-800 text-lg">{st.name}</p>
                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{st.matricule}</p>
                  </td>
                  {selectedClass.subjects.map((sub: string) => (
                    <td key={sub} className="p-4 text-center">
                      <input 
                        type="number" 
                        value={st.grades[sub]}
                        onChange={(e) => updateGradeManually(st.id, sub, e.target.value)}
                        className="w-20 p-4 text-center font-black text-indigo-600 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-lg"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- VUE 2 : HIÉRARCHIE COMPLÈTE ---
  return (
    <div className="p-8 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Grades Hub</h1>
        <div className="flex items-center gap-3">
          <span className="w-12 h-[2px] bg-indigo-600"></span>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Administration des résultats académiques</p>
        </div>
      </div>

      <div className="space-y-6">
        {campus.map((niv) => (
          <div key={niv.nom} className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setExpandedNiveau(expandedNiveau === niv.nom ? null : niv.nom)}
              className="w-full flex items-center justify-between p-8 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-xl transition-all ${expandedNiveau === niv.nom ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-white border border-slate-100 text-indigo-600 shadow-indigo-50'}`}>
                  <GraduationCap size={36} />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{niv.nom}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{niv.filieres.length} Filières spécialisées</p>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${expandedNiveau === niv.nom ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                <ChevronDown size={24} />
              </div>
            </button>

            {expandedNiveau === niv.nom && (
              <div className="p-10 bg-slate-50/50 space-y-10 border-t border-slate-50 animate-in slide-in-from-top duration-500">
                {niv.filieres.length > 0 ? (
                  niv.filieres.map((fil) => (
                    <div key={fil.nom} className="space-y-6">
                      <div className="flex items-center gap-4 px-2">
                        <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                        <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">{fil.nom}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {fil.classes.map((cls) => (
                          <div 
                            key={cls.nom}
                            onClick={() => { setSelectedClass(cls); setView('matrix'); }}
                            className="group relative bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.15)] hover:-translate-y-2"
                          >
                            <div className="flex justify-between items-start mb-8">
                              <div className="p-5 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-3xl transition-all shadow-sm">
                                <LayoutGrid size={28} />
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-black uppercase">Actif</span>
                              </div>
                            </div>
                            <h4 className="text-4xl font-black text-slate-800 mb-2">{cls.nom}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Gestion des relevés</p>
                            
                            <div className="flex justify-between items-center border-t border-slate-50 pt-8">
                               <div className="text-left">
                                 <p className="text-[10px] font-black text-slate-300 uppercase">Matières</p>
                                 <p className="font-black text-indigo-600 italic">{cls.subjects.length}</p>
                               </div>
                               <div className="w-14 h-14 rounded-3xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-lg">
                                 <ChevronRight size={24} />
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="font-black text-slate-300 uppercase tracking-widest text-sm">Aucune filière configurée</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}