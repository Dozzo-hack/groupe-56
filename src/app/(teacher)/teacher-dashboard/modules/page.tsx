"use client";

import React, { useState, useRef } from 'react';
import { 
  BookOpen, Upload, FileText, ArrowLeft, Plus, Users, 
  FolderOpen, ClipboardList, CheckCircle2, Clock, X, Search
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherModules() {
  const [activeTab, setActiveTab] = useState<'cours' | 'devoirs'>('cours');
  const [showDossier, setShowDossier] = useState<any>(null); // État pour la fenêtre "Voir Dossier"
  const [showAddModule, setShowAddModule] = useState(false); // État pour "Nouveau Module"
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modules = [
    { id: 1, name: "Algorithmique Avancée", level: "L3-INFO", students: 45, files: 3 },
    { id: 2, name: "Structures de Données", level: "L2-INFO", students: 38, files: 5 },
  ];

  // Simulation des devoirs remis pour un module précis
  const submissions = [
    { id: 1, student: "Alice Bella", date: "02/05/2026", status: "En attente" },
    { id: 2, student: "Marc Zogo", date: "01/05/2026", status: "Corrigé" },
    { id: 3, student: "Yannick Noah", date: "Hier", status: "En attente" },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-5">
          <Link href="/teacher-dashboard" className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Gestion Académique</h1>
            <p className="text-slate-400 font-bold text-sm">Centralisation des ressources</p>
          </div>
        </div>

        <button 
          onClick={() => setShowAddModule(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-sm hover:shadow-xl transition-all active:scale-95"
        >
          <Plus size={20} /> Nouveau Module
        </button>
      </div>

      {/* GRILLE DES MODULES */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:border-indigo-400 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg">
                {mod.level.split('-')[0]}
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1 rounded-full italic">{mod.level}</span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-6">{mod.name}</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setShowDossier(mod)}
                className="flex items-center justify-center gap-2 py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase hover:bg-slate-900 hover:text-white transition-all"
              >
                <FolderOpen size={14} /> Voir Dossier
              </button>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-[10px] uppercase hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Upload size={14} /> Uploader
              </button>
            </div>
          </div>
        ))}
      </div>

      <input type="file" ref={fileInputRef} className="hidden" />

      {/* --- MODALE : VOIR DOSSIER (DEVOIRS REMIS) --- */}
      {showDossier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-indigo-600 text-white">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{showDossier.name}</h2>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">Devoirs et Travaux remis</p>
              </div>
              <button onClick={() => setShowDossier(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm">{sub.student}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Remis le {sub.date}</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-white border border-slate-200 text-indigo-600 rounded-xl font-black text-[10px] uppercase hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                      Consulter
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALE : NOUVEAU MODULE --- */}
      {showAddModule && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in slide-in-from-top-8 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 italic">Créer un Module</h2>
              <button onClick={() => setShowAddModule(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Nom du Module</label>
                <input type="text" placeholder="ex: Analyse Mathématique" className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-indigo-500 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 italic">Niveau / Classe</label>
                <select className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 ring-indigo-500 font-bold text-slate-600">
                  <option>Licence 1</option>
                  <option>Licence 2</option>
                  <option>Licence 3</option>
                </select>
              </div>
              <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all mt-4">
                Confirmer la création
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}