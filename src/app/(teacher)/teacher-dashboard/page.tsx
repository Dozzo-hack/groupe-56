"use client";

import React from 'react';
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  FileEdit, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const teacherStats = [
    { label: "Étudiants Total", value: "124", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Cours à venir", value: "03", icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Copies à corriger", value: "42", icon: FileEdit, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      
      {/* Hero Section Prof */}
      <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2 tracking-tighter">Espace Enseignant 👨‍🏫</h1>
          <p className="text-slate-400 font-medium">Bon retour, Professeur. Voici votre agenda pour aujourd'hui.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teacherStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Actions Rapides */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 px-2">Actions prioritaires</h2>
          <div className="grid gap-4">
            <Link href="/teacher-dashboard/attendance" className="flex items-center justify-between p-6 bg-indigo-600 text-white rounded-[2rem] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group">
              <div className="flex items-center gap-4">
                <ClipboardCheck size={24} />
                <span className="font-bold text-lg">Faire l'appel (Présences)</span>
              </div>
              <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/teacher-dashboard/grades" className="flex items-center justify-between p-6 bg-white border border-slate-100 text-slate-800 rounded-[2rem] hover:border-indigo-600 transition-all group">
              <div className="flex items-center gap-4">
                <FileEdit size={24} className="text-indigo-600" />
                <span className="font-bold text-lg">Saisir les notes</span>
              </div>
              <ChevronRight className="group-hover:translate-x-2 transition-transform text-slate-300" />
            </Link>
          </div>
        </div>

        {/* Planning du jour */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-800 px-2">Prochain cours</h2>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden">
             <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                   <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-[10px] font-black uppercase">Maintenant</span>
                   <h3 className="text-2xl font-black text-slate-900 mt-4">Algorithmique Avancée</h3>
                   <p className="text-slate-500 font-bold">Amphi B • Niveau 3 • 14:00 - 16:00</p>
                </div>
                <button className="mt-8 text-indigo-600 font-black text-sm flex items-center gap-2 hover:gap-4 transition-all">
                   Démarrer la session <ChevronRight size={18} />
                </button>
             </div>
             <BookOpen size={120} className="absolute -right-8 -bottom-8 text-slate-50 group-hover:text-indigo-50 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}