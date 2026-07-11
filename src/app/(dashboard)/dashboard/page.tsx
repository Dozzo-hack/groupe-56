"use client";

import React, { useState, useEffect } from 'react';
import { Bell, X, Trophy, BookOpen, Clock, TrendingUp, Calendar, FileCheck, Download } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const [showNotifs, setShowNotifs] = useState(false);
  const [schedules, setSchedules] = useState<any[]>([]);

  // Récupérer le vrai planning dynamique
  useEffect(() => {
    fetch('/api/dashboard/student')
      .then(res => res.json())
      .then(data => {
        if(data.schedules) setSchedules(data.schedules);
      });
  }, []);

  const stats = [
    { label: "Moyenne Générale", value: "14.85", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50", link: "/grades" },
    { label: "Cours terminés", value: "12 / 18", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50", link: "/courses" },
    { label: "Absences", value: "02", icon: Clock, color: "text-red-500", bg: "bg-red-50", link: "/attendance" },
    { label: "ECTS Validés", value: "45", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", link: "/grades" },
  ];

  return (
    <div className="space-y-8 md:space-y-10 p-4 md:p-8 relative max-w-7xl mx-auto">
      {/* HEADER AVEC CLOCHE */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter">Mon Dashboard</h1>
        <div className="relative z-50">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-3 md:p-4 rounded-2xl transition-all border ${showNotifs ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:shadow-md'}`}
          >
            <Bell size={20} className="md:w-6 md:h-6" />
            <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </button>
          {showNotifs && (
             // Le bloc notification (je garde ton code tel quel, il est très bien)
             <div className="absolute right-0 mt-4 w-72 md:w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               {/* ... ton code de notif ... */}
               <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                 <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Alertes</span>
                 <button onClick={() => setShowNotifs(false)}><X size={16}/></button>
               </div>
               <div className="p-5 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                  <p className="text-xs font-black text-indigo-600 uppercase">Note publiée</p>
                  <p className="text-sm font-bold text-slate-700">Algorithmique : 16/20</p>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-indigo-600 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-4xl font-black mb-2">Salut, Duhamel !</h2>
          <p className="text-indigo-100 text-sm md:text-base font-medium mb-6">Prêt pour tes cours d'aujourd'hui ?</p>
          <Link href="/courses" className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-xs md:text-sm hover:scale-105 transition-transform">
            Reprendre les cours
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full -mr-10 -mt-10 md:-mr-20 md:-mt-20 blur-3xl"></div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.link} key={i}>
            <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group h-full">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
              <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase truncate">{stat.label}</p>
              <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* REQUÊTES & DOCUMENTS */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* PLANNING DYNAMIQUE (Remplace le dur) */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 p-6 md:p-8 shadow-sm">
          <h3 className="text-lg md:text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600"/> Mon Planning à venir
          </h3>
          <div className="space-y-4">
            {schedules.length === 0 ? (
               <p className="text-slate-400 italic text-sm p-4 bg-slate-50 rounded-xl text-center">Aucun cours programmé dans les prochains jours.</p>
            ) : (
              schedules.map((course, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <p className="font-black text-slate-700 text-sm md:text-base">
                      <span className="text-indigo-600 mr-2">{course.startTime}</span> 
                      {course.moduleId?.title || "Cours"}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1">
                      {new Date(course.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  </div>
                  <div className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                    {course.room} • {course.teacherName}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl">
          <h3 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2">
            <FileCheck size={20} className="text-indigo-400"/> Mes Documents
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-[10px] font-black text-indigo-400 uppercase">Certificat de Scolarité</p>
              <Link href="/tickets" className="mt-2 flex items-center justify-between group">
                <span className="text-sm font-bold">Disponible en ligne</span>
                <Download size={18} className="group-hover:translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}