"use client";

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Save, Send, CheckCircle, 
  FileSpreadsheet, ChevronDown, Users, Target
} from 'lucide-react';
import Link from 'next/link';

// Types pour la structure
type Student = { id: number; name: string; note: string };
type ClassModule = { id: string; name: string; level: string; students: Student[]; status: 'brouillon' | 'envoyé' };

export default function TeacherGrades() {
  // Données simulées : Plusieurs classes pour le même prof
  const [data, setData] = useState<ClassModule[]>([
    {
      id: "algo-l3",
      name: "Algorithmique Avancée",
      level: "L3-INFO",
      status: 'brouillon',
      students: [
        { id: 1, name: "Alice Bella", note: "" },
        { id: 2, name: "Marc Zogo", note: "" }
      ]
    },
    {
      id: "data-l2",
      name: "Structures de Données",
      level: "L2-INFO",
      status: 'brouillon',
      students: [
        { id: 3, name: "Yannick Noah", note: "" },
        { id: 4, name: "Sonia Ebollo", note: "" }
      ]
    }
  ]);

  const [selectedClassId, setSelectedClassId] = useState(data[0].id);
  const currentClass = data.find(c => c.id === selectedClassId)!;

  // --- ACTIONS DES BOUTONS ---

  const handleNoteChange = (studentId: number, value: string) => {
    if (currentClass.status === 'envoyé') return;
    const newData = data.map(c => {
      if (c.id === selectedClassId) {
        return {
          ...c,
          students: c.students.map(s => s.id === studentId ? { ...s, note: value } : s)
        };
      }
      return c;
    });
    setData(newData);
  };

  const handleSave = () => {
    alert(`Sauvegarde locale réussie pour ${currentClass.name} !`);
  };

  const handleTransmit = () => {
    if (confirm(`Voulez-vous vraiment transmettre les notes de ${currentClass.level} à l'administration ? Cette action est irréversible.`)) {
      const newData = data.map(c => c.id === selectedClassId ? { ...c, status: 'envoyé' as const } : c);
      setData(newData);
    }
  };

  const calculateAverage = () => {
    const notes = currentClass.students.map(s => parseFloat(s.note)).filter(n => !isNaN(n));
    return notes.length === 0 ? "0.00" : (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(2);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & SÉLECTEUR DE CLASSE */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-5">
          <Link href="/teacher-dashboard" className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Saisie des Notes</h1>
            {/* SÉLECTEUR DE CLASSE */}
            <div className="relative inline-block">
              <select 
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="appearance-none bg-indigo-50 text-indigo-700 font-black text-xs px-4 py-2 pr-10 rounded-xl outline-none cursor-pointer hover:bg-indigo-100 transition-all border border-indigo-100"
              >
                {data.map(c => (
                  <option key={c.id} value={c.id}>{c.level} - {c.name}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={currentClass.status === 'envoyé'}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-black text-xs hover:bg-slate-200 transition-all disabled:opacity-30"
          >
            <Save size={18} /> Sauvegarder
          </button>
          <button 
            onClick={handleTransmit}
            disabled={currentClass.status === 'envoyé'}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-xs hover:shadow-xl hover:bg-indigo-700 transition-all disabled:bg-slate-200 disabled:text-slate-400"
          >
            <Send size={18} /> Transmettre au PV
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* LISTE DES ÉTUDIANTS */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
             <span className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <Users size={14}/> {currentClass.students.length} Étudiants inscrits
             </span>
             {currentClass.status === 'envoyé' && (
               <span className="text-green-600 font-black text-[10px] uppercase flex items-center gap-1">
                 <CheckCircle size={14}/> Session Verrouillée
               </span>
             )}
          </div>
          
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-50">
              {currentClass.students.map((student) => (
                <tr key={student.id} className="group hover:bg-indigo-50/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-700">{student.name}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        value={student.note}
                        disabled={currentClass.status === 'envoyé'}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        placeholder="--"
                        className="w-16 p-3 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-xl text-center font-black text-indigo-600 outline-none transition-all disabled:opacity-50"
                      />
                      <span className="text-xs font-bold text-slate-300">/ 20</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      parseFloat(student.note) >= 10 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {parseFloat(student.note) >= 10 ? 'Admis' : 'Session 1'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RÉSUMÉ DYNAMIQUE */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <Target className="absolute -right-6 -top-6 text-white/5" size={140} />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Moyenne Section</h3>
            <div className="flex items-end gap-2">
              <span className="text-6xl font-black tracking-tighter leading-none">{calculateAverage()}</span>
              <span className="text-xl font-bold text-slate-500 pb-1">/ 20</span>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Statut PV</span>
                <span className={currentClass.status === 'envoyé' ? "text-green-400" : "text-amber-400"}>
                  {currentClass.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
             <FileSpreadsheet className="text-indigo-600 mb-4" size={24} />
             <h4 className="font-black text-slate-900 text-sm mb-2">Exportation Excel</h4>
             <p className="text-xs text-indigo-600/70 font-medium mb-4 italic">Générez le procès-verbal au format officiel de l'IUT.</p>
             <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase shadow-sm hover:shadow-md transition-all">
               Télécharger le PV
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}