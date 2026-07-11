"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, GraduationCap, BookOpen, Users, Save, ArrowLeft, Upload, LayoutGrid, CheckCircle2, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminGradesFull() {
  const [view, setView] = useState<'hierarchy' | 'matrix'>('hierarchy');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [expandedNiveau, setExpandedNiveau] = useState<string | null>(null);
  const [campus, setCampus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const response = await fetch('/api/grades/admin');
        const data = await response.json();
        setCampus(data.niveaux || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHierarchy();
  }, []);

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

  const updateGradeManually = (studentId: string, subject: string, value: string) => {
    const val = parseFloat(value) || 0;
    const updatedStudents = selectedClass.students.map((s: any) => 
      s.id === studentId ? { ...s, grades: { ...s.grades, [subject]: val } } : s
    );
    setSelectedClass({ ...selectedClass, students: updatedStudents });
  };

  const handleSaveToDB = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/grades/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId: selectedClass.id, students: selectedClass.students })
      });
      alert('Notes administratives enregistrées avec succès.');
    } catch (error) {
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600" size={64} /></div>;

  if (view === 'matrix' && selectedClass) {
    return (
      <div className="p-4 md:p-8 space-y-6 animate-in slide-in-from-right duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 backdrop-blur-md p-4 rounded-3xl border border-white shadow-sm">
          <button onClick={() => setView('hierarchy')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-black px-4 py-2 transition-all">
            <ArrowLeft size={20} /> Retour
          </button>
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
            <label className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 rounded-2xl font-black cursor-pointer hover:bg-indigo-100 transition-all border border-indigo-100">
              <Upload size={18} /> Importer XLSX
              <input type="file" className="hidden" accept=".xlsx" onChange={handleImportGrades} />
            </label>
            <button onClick={handleSaveToDB} disabled={isSaving} className="flex-1 sm:flex-none flex justify-center items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50">
              {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} Sauvegarder
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-6 md:p-8 font-black uppercase text-[11px] text-slate-400 tracking-[0.2em] sticky left-0 z-10 bg-slate-50">Étudiant</th>
                {selectedClass.subjects.map((sub: string) => (
                  <th key={sub} className="p-6 md:p-8 font-black uppercase text-[11px] text-slate-400 tracking-[0.2em] text-center">{sub}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {selectedClass.students.map((st: any) => (
                <tr key={st.id} className="hover:bg-indigo-50/20 transition-colors">
                  <td className="p-6 md:p-8 sticky left-0 z-10 bg-white shadow-[10px_0_15px_-10px_rgba(0,0,0,0.05)]">
                    <p className="font-black text-slate-800 text-sm md:text-lg">{st.name}</p>
                    <p className="text-[10px] md:text-xs font-bold text-indigo-500 uppercase tracking-widest">{st.matricule}</p>
                  </td>
                  {selectedClass.subjects.map((sub: string) => (
                    <td key={sub} className="p-4 text-center">
                      <input 
                        type="number" 
                        value={st.grades[sub]}
                        onChange={(e) => updateGradeManually(st.id, sub, e.target.value)}
                        className="w-16 md:w-20 p-3 md:p-4 text-center font-black text-indigo-600 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-indigo-500 focus:bg-white outline-none transition-all text-sm md:text-lg"
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

  return (
    <div className="p-4 md:p-8 space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Grades Hub</h1>
        <div className="flex items-center gap-3">
          <span className="w-12 h-[2px] bg-indigo-600 shrink-0"></span>
          <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.4em]">Administration des résultats</p>
        </div>
      </div>

      <div className="space-y-6">
        {campus.length === 0 ? (
           <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-100">Aucun niveau configuré dans la base de données.</div>
        ) : campus.map((niv) => (
          <div key={niv.nom} className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm">
            <button 
              onClick={() => setExpandedNiveau(expandedNiveau === niv.nom ? null : niv.nom)}
              className="w-full flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 hover:bg-slate-50 transition-all gap-4"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-xl transition-all shrink-0 ${expandedNiveau === niv.nom ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-white border border-slate-100 text-indigo-600 shadow-indigo-50'}`}>
                  <GraduationCap size={32} />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{niv.nom}</h2>
                  <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">{niv.filieres.length} Filières spécialisées</p>
                </div>
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 self-end md:self-auto ${expandedNiveau === niv.nom ? 'bg-indigo-600 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                <ChevronDown size={24} />
              </div>
            </button>

            {expandedNiveau === niv.nom && (
              <div className="p-6 md:p-10 bg-slate-50/50 space-y-10 border-t border-slate-50 animate-in slide-in-from-top duration-500">
                {niv.filieres.map((fil: any) => (
                  <div key={fil.nom} className="space-y-6">
                    <div className="flex items-center gap-4 px-2">
                      <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                      <h3 className="font-black text-slate-800 uppercase text-xs md:text-sm tracking-widest">{fil.nom}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                      {fil.classes.map((cls: any) => (
                        <div 
                          key={cls.nom}
                          onClick={() => { setSelectedClass(cls); setView('matrix'); }}
                          className="group relative bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.15)] hover:-translate-y-2"
                        >
                          <div className="flex justify-between items-start mb-6 md:mb-8">
                            <div className="p-4 md:p-5 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl md:rounded-3xl transition-all shadow-sm">
                              <LayoutGrid size={24} className="md:w-7 md:h-7" />
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-green-50 text-green-600 rounded-full">
                              <CheckCircle2 size={12} className="md:w-3.5 md:h-3.5" />
                              <span className="text-[9px] md:text-[10px] font-black uppercase">Actif</span>
                            </div>
                          </div>
                          <h4 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">{cls.nom}</h4>
                          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 md:mb-8">Gestion des relevés</p>
                          
                          <div className="flex justify-between items-center border-t border-slate-50 pt-6 md:pt-8">
                             <div className="text-left">
                               <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase">Matières</p>
                               <p className="font-black text-indigo-600 italic text-sm md:text-base">{cls.subjects.length}</p>
                             </div>
                             <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-indigo-600 transition-all shadow-lg">
                               <ChevronRight size={20} className="md:w-6 md:h-6" />
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}