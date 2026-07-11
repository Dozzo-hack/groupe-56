"use client";

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, ClipboardCheck, FileEdit, Calendar, ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [nextCourses, setNextCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/teacher')
      .then(res => res.json())
      .then(data => {
        if(data.schedules) setNextCourses(data.schedules);
      });
  }, []);

  const teacherStats = [
    { label: "Étudiants Total", value: "124", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Cours à venir", value: nextCourses.length.toString().padStart(2, '0'), icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Copies à corriger", value: "42", icon: FileEdit, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const upcomingCourse = nextCourses[0]; // Le tout premier cours

  return (
    <div className="p-4 md:p-8 space-y-8 md:space-y-10 animate-in fade-in duration-700 max-w-7xl mx-auto">
      
      {/* Hero Section Prof */}
      <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-4xl font-black mb-2 tracking-tighter">Espace Enseignant 👨‍🏫</h1>
          <p className="text-slate-400 text-sm md:text-base font-medium">Bon retour, Professeur. Voici votre agenda pour aujourd'hui.</p>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-indigo-500/10 rounded-full -mr-10 -mt-10 md:-mr-20 md:-mt-20 blur-3xl"></div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        {teacherStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
            <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} className="md:w-7 md:h-7" />
            </div>
            <div className="text-right">
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
        {/* Actions Rapides */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 px-2">Actions prioritaires</h2>
          <div className="grid gap-4">
            <Link href="/teacher-dashboard/attendance" className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-indigo-600 text-white rounded-[1.5rem] md:rounded-[2rem] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 group gap-4 md:gap-0">
              <div className="flex items-center gap-4">
                <ClipboardCheck size={24} />
                <span className="font-bold text-base md:text-lg">Faire l'appel (Présences)</span>
              </div>
              <ChevronRight className="hidden md:block group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/teacher-dashboard/grades" className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-100 text-slate-800 rounded-[1.5rem] md:rounded-[2rem] hover:border-indigo-600 transition-all group gap-4 md:gap-0">
              <div className="flex items-center gap-4">
                <FileEdit size={24} className="text-indigo-600" />
                <span className="font-bold text-base md:text-lg">Saisir les notes</span>
              </div>
              <ChevronRight className="hidden md:block group-hover:translate-x-2 transition-transform text-slate-300" />
            </Link>
          </div>
        </div>

        {/* Planning du jour DYNAMIQUE */}
        <div className="space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 px-2">Prochain cours</h2>
          <div className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm relative group overflow-hidden h-[250px] md:h-[300px]">
             {upcomingCourse ? (
               <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                     <span className="bg-green-100 text-green-700 px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase inline-flex items-center gap-1">
                       <Clock size={12} /> À venir
                     </span>
                     <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-4 md:mt-6 line-clamp-2">
                       {upcomingCourse.moduleId?.title}
                     </h3>
                     <p className="text-slate-500 font-bold text-sm md:text-base mt-2">
                       {upcomingCourse.classId?.name} • {upcomingCourse.room}
                     </p>
                     <p className="text-slate-400 font-bold text-xs mt-1">
                       {new Date(upcomingCourse.date).toLocaleDateString('fr-FR')} de {upcomingCourse.startTime} à {upcomingCourse.endTime}
                     </p>
                  </div>
                  <button className="mt-6 md:mt-8 text-indigo-600 font-black text-xs md:text-sm flex items-center gap-2 hover:gap-4 transition-all w-fit bg-indigo-50 px-4 py-2 rounded-xl">
                     Démarrer la session <ChevronRight size={16} />
                  </button>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center h-full text-center space-y-4 z-10 relative">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                    <Calendar className="text-slate-300" size={32} />
                  </div>
                  <p className="text-slate-400 font-bold">Aucun cours prévu prochainement.</p>
               </div>
             )}
             <BookOpen size={100} className="md:w-[120px] md:h-[120px] absolute -right-4 -bottom-4 md:-right-8 md:-bottom-8 text-slate-50 group-hover:text-indigo-50/50 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}