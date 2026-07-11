"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, ChevronRight, ChevronDown, BookOpen, Users, 
  AlertTriangle, CheckCircle, Calendar, RefreshCw
} from 'lucide-react';

interface ClassAttendance {
  id: string; // ex: L1-GI-FI-A
  nom: string;
  classroom: string;
  totalStudents: number;
  avgAttendance: string; // ex: "85%"
  status: "Excellent" | "Normal" | "Alerte";
}

interface FiliereData {
  nom: string;
  classes: ClassAttendance[];
}

interface NiveauData {
  nom: string;
  filieres: FiliereData[];
}

export default function AdminAttendanceManagement() {
  const [campus, setCampus] = useState<NiveauData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [expandedNiveau, setExpandedNiveau] = useState<string | null>(null);
  const [expandedFiliere, setExpandedFiliere] = useState<string | null>(null);

  // Vue détaillée d'une classe sélectionnée
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [subjectDetails, setSubjectDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

  const fetchAttendanceHierarchy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/attendance/hierarchy');
      if (response.ok) {
        const data = await response.json();
        setCampus(data || []);
      }
    } catch (error) {
      console.error("Erreur de récupération de l'assiduité globale", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassSubjectDetails = async (classId: string) => {
    setLoadingDetails(true);
    setSelectedClassId(classId);
    try {
      const response = await fetch(`/api/admin/attendance/class/${classId}`);
      if (response.ok) {
        const data = await response.json();
        setSubjectDetails(data || []);
      }
    } catch (error) {
      console.error("Erreur détails matières", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchAttendanceHierarchy();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Supervision des Présences</h1>
          <p className="text-slate-500 font-medium text-sm">Contrôle global et état de l'assiduité du campus</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl w-fit">
          <Calendar className="text-indigo-600 ml-2" size={20} />
          <span className="font-black text-slate-700 pr-4 text-xs md:text-sm">Semestre actuel - 2026</span>
        </div>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Filtrer ou chercher un niveau, une filière..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 shadow-sm font-medium transition-all text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-slate-400 gap-2 font-bold">
          <RefreshCw className="animate-spin"/> Synchronisation des registres d'appel...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Arborescence (2 Colonnes si un détail est ouvert) */}
          <div className={`space-y-4 ${selectedClassId ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {campus.map((niv) => (
              <div key={niv.nom} className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setExpandedNiveau(expandedNiveau === niv.nom ? null : niv.nom)}
                  className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl"><BookOpen size={20} /></div>
                    <span className="text-lg font-black text-slate-800">{niv.nom}</span>
                  </div>
                  {expandedNiveau === niv.nom ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                </button>

                {expandedNiveau === niv.nom && (
                  <div className="p-4 bg-slate-50/50 space-y-3 border-t border-slate-50">
                    {niv.filieres.map((fil) => (
                      <div key={fil.nom} className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">
                        <button 
                          onClick={() => setExpandedFiliere(expandedFiliere === fil.nom ? null : fil.nom)}
                          className="w-full flex items-center justify-between p-4 hover:bg-indigo-50/20 transition-all"
                        >
                          <span className="font-bold text-sm text-slate-700">{fil.nom}</span>
                          {expandedFiliere === fil.nom ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>

                        {expandedFiliere === fil.nom && (
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/30">
                            {fil.classes.map((cls) => (
                              <div key={cls.id} className={`p-5 rounded-xl bg-white border transition-all flex flex-col justify-between ${selectedClassId === cls.id ? 'border-indigo-600 ring-2 ring-indigo-500/10' : 'border-slate-100 shadow-sm'}`}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-black text-slate-800 text-sm">{cls.nom}</span>
                                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${cls.status === 'Alerte' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                    {cls.status}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mb-4 uppercase">{cls.classroom} • {cls.totalStudents} étudiants</p>
                                
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
                                    <span>Présence Moyenne</span>
                                    <span className={cls.status === 'Alerte' ? 'text-red-500' : 'text-indigo-600'}>{cls.avgAttendance}</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${cls.status === 'Alerte' ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: cls.avgAttendance }}></div>
                                  </div>
                                </div>

                                <button 
                                  onClick={() => fetchClassSubjectDetails(cls.id)}
                                  className="w-full py-2 bg-slate-50 hover:bg-indigo-600 text-slate-600 hover:text-white font-black text-xs rounded-lg transition-all flex items-center justify-center gap-1"
                                >
                                  Analyser les modules <ChevronRight size={14}/>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Panneau latéral de détails par matière */}
          {selectedClassId && (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-6 lg:col-span-1 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                <div>
                  <h3 className="font-black text-slate-900 text-lg">Détails Modules</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase">{selectedClassId}</p>
                </div>
                <button onClick={() => setSelectedClassId(null)} className="text-xs font-black bg-slate-100 px-3 py-1.5 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors">
                  Fermer
                </button>
              </div>

              {loadingDetails ? (
                <div className="text-center py-8 text-slate-400 text-xs font-bold flex justify-center items-center gap-2">
                  <RefreshCw className="animate-spin" size={14}/> Tri des modules...
                </div>
              ) : (
                <div className="space-y-4">
                  {subjectDetails.map((sub: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                      <p className="font-black text-slate-800 text-sm truncate">{sub.subject}</p>
                      
                      <div className="flex flex-col gap-2 text-xs text-slate-500 font-medium">
                        <div className="flex justify-between">
                          <span>Heures : <b>{sub.hoursDone}h</b></span>
                          <span className={sub.alertCount > 0 ? "text-red-500 font-bold" : "text-slate-400"}>
                            {sub.alertCount} Élève(s) en alerte
                          </span>
                        </div>
                        
                        {/* Affichage exact des étudiants critiques */}
                        {sub.alertStudents && sub.alertStudents.length > 0 && (
                          <div className="p-2 bg-red-50/50 border border-red-100 rounded-lg text-red-600 space-y-1 mt-2">
                            <p className="font-bold text-[10px] uppercase tracking-wider text-red-400 mb-1">Étudiants concernés :</p>
                            {sub.alertStudents.map((student: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center bg-white p-1.5 rounded shadow-sm">
                                <span className="font-bold">{student.matricule}</span>
                                <span className="text-[10px] px-1.5 py-0.5 bg-red-100 rounded-full">{student.count} absences</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {subjectDetails.length === 0 && (
                    <p className="text-center text-xs font-bold text-slate-400 py-4">Aucun module n'a encore été dispensé dans cette classe.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}