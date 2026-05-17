"use client";

import React, { useState } from 'react';
import { 
  UserPlus, FileSpreadsheet, ChevronRight, ChevronDown, 
  GraduationCap, BookOpen, Users, Archive, Trash2, X,
  ArrowUpCircle, Phone, MapPin, Mail, Lock, ArrowLeft
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminCampusFullManagement() {
  const [view, setView] = useState<'hierarchy' | 'classList'>('hierarchy');
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [expandedNiveau, setExpandedNiveau] = useState<string | null>(null);
  const [expandedFiliere, setExpandedFiliere] = useState<string | null>(null);

  // État pour le Modal d'importation
  const [showImportModal, setShowImportModal] = useState(false);
  const [importConfig, setImportConfig] = useState({ niveau: "", filiere: "", classe: "" });
  const [tempData, setTempData] = useState<any[]>([]);

  // Simulation des données avec détails complets
  const [campus, setCampus] = useState([
    {
      nom: "Niveau 3",
      filieres: [
        { 
          nom: "Génie Logiciel", 
          classes: [
            { 
              nom: "GL-A", 
              students: [
                { id: 1, name: "Jean Dupont", matricule: "4402", email: "jean@iut.cm", phone: "699001122", quartier: "Ange Raphaël", pass: "123456", status: "Actif" },
                { id: 2, name: "Marie Sali", matricule: "1289", email: "marie@iut.cm", phone: "677889900", quartier: "Bonamoussadi", pass: "azerty", status: "Actif" }
              ] 
            },
            { nom: "GL-B", students: [] }
          ] 
        },
      ]
    },
    { nom: "Niveau 2", filieres: [] },
    { nom: "Niveau 1", filieres: [] }
  ]);

  // Fonctions de gestion de cycle
  const promoteClass = () => alert(`Promotion de la classe ${selectedClass.nom} vers le niveau supérieur !`);
  const graduateClass = () => alert(`Félicitations ! La classe ${selectedClass.nom} est maintenant diplômée.`);
  const archiveStudent = (id: number) => alert(`Étudiant ${id} déplacé vers les archives.`);

  // --- LOGIQUE D'IMPORTATION ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setTempData(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const finalizeImport = () => {
    setShowImportModal(false);
    setTempData([]);
    alert("Étudiants ajoutés avec succès !");
  };

  // --- VUE 1 : LISTE DÉTAILLÉE DE LA CLASSE ---
  if (view === 'classList' && selectedClass) {
    return (
      <div className="p-8 space-y-6 animate-in slide-in-from-right duration-300">
        <button onClick={() => setView('hierarchy')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-black transition-all">
          <ArrowLeft size={20} /> Retour à la structure
        </button>

        <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Classe : {selectedClass.nom}</h2>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">{selectedClass.students.length} Étudiants inscrits</p>
          </div>
          <div className="flex gap-3">
            <button onClick={promoteClass} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-sm hover:bg-blue-600 hover:text-white transition-all">
              <ArrowUpCircle size={18} /> Promouvoir la classe
            </button>
            <button onClick={graduateClass} className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-xl font-black text-sm hover:bg-purple-600 hover:text-white transition-all">
              <GraduationCap size={18} /> Diplômer
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="p-6">Informations Étudiant</th>
                <th className="p-6">Contact & Localisation</th>
                <th className="p-6">Sécurité</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {selectedClass.students.map((st: any) => (
                <tr key={st.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-6">
                    <p className="font-black text-slate-800">{st.name}</p>
                    <p className="text-xs font-bold text-blue-600">Matricule: {st.matricule}</p>
                  </td>
                  <td className="p-6 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Mail size={14}/> {st.email}</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600"><Phone size={14}/> {st.phone}</div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase"><MapPin size={14}/> {st.quartier}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 bg-slate-100 w-fit px-3 py-1 rounded-lg">
                      <Lock size={12} className="text-slate-400"/>
                      <span className="text-xs font-mono font-bold text-slate-600">{st.pass}</span>
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => archiveStudent(st.id)} title="Archiver" className="p-2 text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                        <Archive size={18} />
                      </button>
                      <button title="Supprimer" className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- VUE 2 : STRUCTURE HIÉRARCHIQUE (DRILL-DOWN) ---
  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Annuaire Campus</h1>
          <p className="text-slate-500 font-medium text-sm">Naviguez par niveau et filière pour gérer les classes.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
            <FileSpreadsheet size={18} /> Importation XLSX
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {campus.map((niv) => (
          <div key={niv.nom} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setExpandedNiveau(expandedNiveau === niv.nom ? null : niv.nom)}
              className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><GraduationCap /></div>
                <span className="text-xl font-black text-slate-800">{niv.nom}</span>
              </div>
              {expandedNiveau === niv.nom ? <ChevronDown /> : <ChevronRight />}
            </button>

            {expandedNiveau === niv.nom && (
              <div className="p-4 bg-slate-50/50 space-y-3 border-t border-slate-50">
                {niv.filieres.map((fil) => (
                  <div key={fil.nom} className="bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden">
                    <button 
                      onClick={() => setExpandedFiliere(expandedFiliere === fil.nom ? null : fil.nom)}
                      className="w-full flex items-center justify-between p-5 hover:bg-blue-50/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 text-slate-500 rounded-xl"><BookOpen size={20} /></div>
                        <span className="font-bold text-slate-700">{fil.nom}</span>
                      </div>
                      {expandedFiliere === fil.nom ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    {expandedFiliere === fil.nom && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/30">
                        {fil.classes.map((cls) => (
                          <div key={cls.nom} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <Users size={18} className="text-blue-500" />
                                <span className="font-black text-slate-800">{cls.nom}</span>
                              </div>
                              <span className="text-[10px] font-black px-2 py-1 bg-slate-100 rounded-md uppercase">{cls.students.length} Étudiants</span>
                            </div>
                            <button 
                              onClick={() => { setSelectedClass(cls); setView('classList'); }}
                              className="w-full py-2 text-xs font-black text-blue-600 border border-blue-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                            >
                              Voir la liste complète
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

      {/* --- MODAL D'IMPORTATION (Configuration) --- */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
              <h2 className="text-2xl font-black">Configuration de l'Import</h2>
              <button onClick={() => setShowImportModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Niveau</label>
                  <select onChange={(e) => setImportConfig({...importConfig, niveau: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>Sélectionner</option>
                    <option>Niveau 1</option><option>Niveau 2</option><option>Niveau 3</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Filière</label>
                  <select onChange={(e) => setImportConfig({...importConfig, filiere: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                    <option>Sélectionner</option>
                    <option>Génie Logiciel</option><option>Réseaux</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1">Classe</label>
                  <input type="text" placeholder="ex: GL-A" onChange={(e) => setImportConfig({...importConfig, classe: e.target.value})} className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>
              </div>
              <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-10 text-center hover:bg-blue-50/50 transition-all relative">
                <input type="file" accept=".xlsx" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <FileSpreadsheet className="mx-auto text-blue-600 mb-2" size={32} />
                <p className="font-bold text-slate-700">{tempData.length > 0 ? `${tempData.length} étudiants détectés` : "Choisir le fichier XLSX"}</p>
              </div>
              <button onClick={finalizeImport} disabled={!importConfig.classe || tempData.length === 0} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 disabled:bg-slate-200 transition-all">
                Valider et Ajouter au Campus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}