"use client";

import React, { useState } from 'react';
import { 
  Bell, X, Trophy, BookOpen, Clock, TrendingUp, 
  Calendar, FileCheck, Download, MessageSquare, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  // Correction 1: État pour les notifications
  const [showNotifs, setShowNotifs] = useState(false);

  const stats = [
    { label: "Moyenne Générale", value: "14.85", icon: Trophy, color: "text-amber-500", bg: "bg-amber-50", link: "/grades" },
    { label: "Cours terminés", value: "12 / 18", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-50", link: "/courses" },
    { label: "Absences", value: "02", icon: Clock, color: "text-red-500", bg: "bg-red-50", link: "/attendance" },
    { label: "ECTS Validés", value: "45", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", link: "/grades" },
  ];

  return (
    <div className="space-y-10 p-4 md:p-8 relative">
      
      {/* HEADER AVEC CLOCHE FONCTIONNELLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Mon Dashboard</h1>
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-4 rounded-2xl transition-all border ${showNotifs ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:shadow-md'}`}
          >
            <Bell size={24} />
            <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Menu Déroulant des Notifications */}
          {showNotifs && (
            <>
              {/* Overlay pour fermer en cliquant à côté */}
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}></div>
              
              <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Alertes</span>
                  <button onClick={() => setShowNotifs(false)}><X size={16}/></button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <div className="p-5 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                    <p className="text-xs font-black text-indigo-600 uppercase">Note publiée</p>
                    <p className="text-sm font-bold text-slate-700">Algorithmique : 16/20</p>
                  </div>
                  <div className="p-5 hover:bg-slate-50 cursor-pointer">
                    <p className="text-xs font-black text-green-600 uppercase">Requête traitée</p>
                    <p className="text-sm font-bold text-slate-700">Certificat de scolarité prêt</p>
                  </div>
                </div>
                <Link href="/tickets" className="block p-4 text-center text-[10px] font-black text-indigo-600 bg-indigo-50/50 uppercase">
                  Voir tout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-2">Salut, Duhamel !</h2>
          <p className="text-indigo-100 font-medium mb-6">Prêt pour tes cours d'aujourd'hui ?</p>
          <Link href="/courses" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 transition-transform">
            Reprendre les cours
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
      </div>

      {/* STATS AVEC LIENS CORRIGÉS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.link} key={i}>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* REQUÊTES & DOCUMENTS */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-indigo-600"/> Planning du jour
          </h3>
          <div className="space-y-4">
             {/* Contenu de ton planning ici */}
             <div className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all">
                <p className="font-black text-slate-700">08:00 - Base de Données</p>
                <p className="text-xs font-bold text-slate-400 italic">Amphi A • Dr. Kamga</p>
             </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
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