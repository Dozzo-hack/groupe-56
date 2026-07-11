"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, ChevronRight, ChevronDown, BookOpen, Users, 
  Archive, Trash2, X, Phone, MapPin, Mail, Lock, ArrowLeft, RefreshCw 
} from 'lucide-react';

// 1. Définition des interfaces pour bloquer l'apparition du type 'never'
interface StudentData {
  id: string;
  name: string;
  matricule: string;
  email: string;
  phone: string;
  location: string;
  pass: string;
  status: string;
}

interface ClassData {
  nom: string;
  classroom: string;
  students: StudentData[];
}

interface FiliereData {
  nom: string;
  classes: ClassData[];
}

interface NiveauData {
  nom: string;
  rawLevel: number;
  filieres: FiliereData[];
}

export default function AdminCampusFullManagement() {
  // Typage strict des états
  const [view, setView] = useState<string>('hierarchy'); 
  const [campus, setCampus] = useState<NiveauData[]>([]);
  const [dbClasses, setDbClasses] = useState<any[]>([]); 
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [expandedNiveau, setExpandedNiveau] = useState<string | null>(null);
  const [expandedFiliere, setExpandedFiliere] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // États du Modal d'importation
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [importClassCode, setImportClassCode] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // Charger l'arborescence complète
  const fetchCampusData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/classes/hierarchy');
      if (response.ok) {
        const data = await response.json();
        setCampus(data || []);
      }
    } catch (error) {
      console.error("Erreur de récupération des structures globales", error);
    } finally { // <-- Correction appliquée ici avec deux "l" !
      setLoading(false);
    }
  };

  // Charger les classes brutes pour le sélecteur
  const fetchAvailableClasses = async () => {
    try {
      const response = await fetch('/api/admin/classes');
      if (response.ok) {
        const data = await response.json();
        setDbClasses(data || []);
      }
    } catch (error) {
      console.error("Erreur de chargement de la liste des classes", error);
    }
  };

  useEffect(() => {
    fetchCampusData();
    fetchAvailableClasses();
  }, []);

  // --- ACTIONS ---

  const handleArchiveStudent = async (studentId: string) => {
    if (!confirm("Voulez-vous figer et archiver le parcours de cet étudiant ?")) return;
    try {
      const res = await fetch(`/api/admin/students/${studentId}/archive`, { method: 'PATCH' });
      if (res.ok) {
        alert("Parcours archivé avec succès.");
        fetchCampusData();
        setView('hierarchy');
      }
    } catch (err) {
      alert("Impossible d'archiver l'étudiant.");
    }
  };

  const handleDeleteStudentLink = async (studentId: string) => {
    if (!confirm("Retirer définitivement cet étudiant de l'établissement ?")) return;
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Étudiant supprimé avec succès.");
        fetchCampusData();
        setView('hierarchy');
      }
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const executeXlsxImport = async () => {
    if (!selectedFile || !importClassCode) {
      setFeedbackMessage("❌ Veuillez sélectionner une classe et charger un fichier Excel.");
      return;
    }

    setImporting(true);
    setFeedbackMessage('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('classCode', importClassCode);

    try {
      const response = await fetch('/api/admin/students/import', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (response.ok) {
        setFeedbackMessage(`🎉 ${data.message}`);
        setTimeout(() => {
          setShowImportModal(false);
          setSelectedFile(null);
          setImportClassCode("");
          fetchCampusData();
        }, 2000);
      } else {
        setFeedbackMessage(`❌ ${data.message || "Erreur lors du traitement."}`);
      }
    } catch (error) {
      setFeedbackMessage("❌ Erreur critique de liaison avec le serveur.");
    } finally {
      setImporting(false);
    }
  };

  // --- VUE 1 : PANNEAU DES ÉTUDIANTS ---
  if (view === 'classList' && selectedClass) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <button onClick={() => setView('hierarchy')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black transition-all text-sm md:text-base">
          <ArrowLeft size={18} /> Retour à la structure
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Classe : {selectedClass.nom}</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-1">Salle : {selectedClass.classroom}</p>
          </div>
          <div className="text-sm bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl font-black">
            {(selectedClass.students || []).length} Étudiants en liste
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
          {/* Mobile */}
          <div className="block md:hidden divide-y divide-slate-100">
            {(!selectedClass.students || selectedClass.students.length === 0) ? (
              <p className="p-8 text-center text-slate-400 font-bold text-sm">Aucun étudiant inscrit.</p>
            ) : (
              selectedClass.students.map((st) => (
                <div key={st.id} className="p-4 space-y-3 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-slate-800 text-base">{st.name}</p>
                      <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Matricule: {st.matricule}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleArchiveStudent(st.id)} className="p-2 text-amber-500 bg-amber-50 rounded-lg">
                        <Archive size={16} />
                      </button>
                      <button onClick={() => handleDeleteStudentLink(st.id)} className="p-2 text-red-500 bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-slate-600 space-y-1">
                    <div className="flex items-center gap-2"><Mail size={12} className="text-slate-400"/> {st.email}</div>
                    <div className="flex items-center gap-2"><Phone size={12} className="text-slate-400"/> {st.phone}</div>
                    <div className="flex items-center gap-2 text-[10px] uppercase text-slate-400"><MapPin size={12}/> {st.location}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop */}
          <table className="hidden md:table w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="p-6">Informations Étudiant</th>
                <th className="p-6">Contact & Localisation</th>
                <th className="p-6">Sécurité</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(!selectedClass.students || selectedClass.students.length === 0) ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-400 font-bold">Aucun étudiant dans cette salle.</td>
                </tr>
              ) : (
                selectedClass.students.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-6">
                      <p className="font-black text-slate-800">{st.name}</p>
                      <p className="text-xs font-bold text-blue-600">Matricule: {st.matricule}</p>
                    </td>
                    <td className="p-6 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Mail size={14}/> {st.email}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Phone size={14}/> {st.phone}</div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase"><MapPin size={14}/> {st.location}</div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 bg-slate-100 w-fit px-3 py-1 rounded-lg">
                        <Lock size={12} className="text-slate-400"/>
                        <span className="text-xs font-mono font-bold text-slate-600">{st.pass}</span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleArchiveStudent(st.id)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                          <Archive size={18} />
                        </button>
                        <button onClick={() => handleDeleteStudentLink(st.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- VUE 2 : ARBORESCENCE CAMPUS ---
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Annuaire Campus</h1>
          <p className="text-slate-500 font-medium text-xs md:text-sm">Parcourez la hiérarchie pour administrer les effectifs.</p>
        </div>
        <div>
          <button onClick={() => setShowImportModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-md text-sm">
            <FileSpreadsheet size={18} /> Importation Collective (XLSX)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12 text-slate-400 gap-2 font-bold">
          <RefreshCw className="animate-spin"/> Chargement des structures...
        </div>
      ) : (
        <div className="space-y-4">
          {campus.map((niv) => (
            <div key={niv.nom} className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <button 
                onClick={() => setExpandedNiveau(expandedNiveau === niv.nom ? null : niv.nom)}
                className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-lg md:text-xl font-black text-slate-800">{niv.nom}</span>
                </div>
                {expandedNiveau === niv.nom ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
              </button>

              {expandedNiveau === niv.nom && (
                <div className="p-3 md:p-4 bg-slate-50/50 space-y-3 border-t border-slate-50">
                  {(niv.filieres || []).map((fil) => (
                    <div key={fil.nom} className="bg-white rounded-[1.2rem] md:rounded-[1.5rem] border border-slate-100 overflow-hidden">
                      <button 
                        onClick={() => setExpandedFiliere(expandedFiliere === fil.nom ? null : fil.nom)}
                        className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-blue-50/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 text-slate-500 rounded-xl"><BookOpen size={18} /></div>
                          <span className="font-bold text-sm md:text-base text-slate-700">{fil.nom}</span>
                        </div>
                        {expandedFiliere === fil.nom ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>

                      {expandedFiliere === fil.nom && (
                        <div className="p-3 md:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-slate-50/30">
                          {(fil.classes || []).map((cls) => (
                            <div key={cls.nom} className="bg-white p-4 md:p-5 rounded-xl border border-blue-100 shadow-sm flex flex-col justify-between">
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                  <Users size={16} className="text-blue-500" />
                                  <div>
                                    <span className="font-black text-slate-800 text-sm md:text-base block">{cls.nom}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{cls.classroom}</span>
                                  </div>
                                </div>
                                <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-md uppercase text-slate-500">{(cls.students || []).length} Inscrits</span>
                              </div>
                              <button 
                                onClick={() => { setSelectedClass(cls); setView('classList'); }}
                                className="w-full py-2 text-xs font-black text-blue-600 border border-blue-50 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-center"
                              >
                                Gérer les étudiants
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
      )}

      {/* --- MODAL D'IMPORTATION --- */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="p-6 flex justify-between items-center bg-slate-900 text-white">
              <h2 className="text-xl font-black">Configuration de l'Import</h2>
              <button onClick={() => { setShowImportModal(false); setFeedbackMessage(''); setSelectedFile(null); }} className="p-2 hover:bg-white/10 rounded-full"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Classe cible</label>
                <select 
                  value={importClassCode} 
                  onChange={(e) => setImportClassCode(e.target.value)} 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-slate-800 outline-none focus:border-blue-500 transition-all"
                >
                  <option value="">-- Sélectionnez la classe --</option>
                  {dbClasses.map((c) => (
                    <option key={c._id || c.name} value={c.name}>
                      {c.name} ({c.classroom || "Sans salle"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-blue-50/30 transition-all relative">
                <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <FileSpreadsheet className="mx-auto text-blue-600 mb-2" size={28} />
                <p className="font-bold text-xs text-slate-700">
                  {selectedFile ? selectedFile.name : "Cliquez ou glissez votre fichier Excel (.xlsx)"}
                </p>
              </div>

              {feedbackMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold text-center ${feedbackMessage.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {feedbackMessage}
                </div>
              )}

              <button 
                onClick={executeXlsxImport} 
                disabled={!importClassCode || !selectedFile || importing} 
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 transition-all text-center flex justify-center items-center gap-2"
              >
                {importing && <RefreshCw className="animate-spin" size={16}/>}
                {importing ? "Traitement..." : "Lancer l'intégration collective"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}