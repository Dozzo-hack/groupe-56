"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, MessageSquare, TrendingUp, 
  AlertCircle, CheckCircle2, Clock, ChevronRight,
  ArrowUpRight, FileBarChart, Bell, X, Send
} from 'lucide-react';

export default function AdminMainDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulation des notifications non consultées
  const notifications = [
    { id: 1, title: "Nouvelle requête", msg: "Paul Biya: Erreur de note...", time: "10m", read: false },
    { id: 2, title: "Fichier reçu", msg: "Justificatif de paiement SN-2A", time: "1h", read: false },
  ];

  const stats = [
    { label: "Total Étudiants", value: "1,284", icon: Users, iconColor: "text-blue-600", bg: "bg-blue-50", link: "/admin-dashboard/students" },
    { label: "Requêtes Ouvertes", value: "24", icon: MessageSquare, iconColor: "text-amber-600", bg: "bg-amber-50", link: "/admin-dashboard/requests" },
    { label: "Moyenne Campus", value: "12.85", icon: TrendingUp, iconColor: "text-green-600", bg: "bg-green-50", link: "/admin-dashboard/grades" },
    { label: "Taux de Réussite", value: "84%", icon: CheckCircle2, iconColor: "text-indigo-600", bg: "bg-indigo-50", link: "/admin-dashboard/grades" },
  ];

  return (
    <div className="p-8 space-y-10 relative">
      
      {/* HEADER AVEC GESTION DES NOTIFICATIONS */}
      <div className="flex justify-between items-center relative">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Hello, Admin !</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Système opérationnel • 30 Avril 2026
          </p>
        </div>

        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-4 rounded-3xl border transition-all ${showNotifications ? 'bg-slate-900 text-white' : 'bg-white border-slate-100 text-slate-600 shadow-sm hover:shadow-md'}`}
            >
                <Bell size={24} />
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </button>

            {/* VOLET DES NOTIFICATIONS (CARDS) */}
            {showNotifications && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                        <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Messages récents</h4>
                        <button onClick={() => setShowNotifications(false)}><X size={16} className="text-slate-400" /></button>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto">
                        {notifications.map((n) => (
                            <div key={n.id} className="p-5 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-tighter">{n.title}</span>
                                    <span className="text-[9px] font-bold text-slate-300">{n.time}</span>
                                </div>
                                <p className="text-sm font-bold text-slate-600 leading-tight">{n.msg}</p>
                            </div>
                        ))}
                    </div>
                    <Link href="/admin-dashboard/requests" className="block p-4 text-center text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase transition-all bg-slate-50">
                        Voir tout le centre de support
                    </Link>
                </div>
            )}
        </div>
      </div>

      {/* CARTES DE STATS INTERACTIVES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Link href={stat.link} key={i}>
            <div className="group bg-white p-8 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer">
                <div className={`w-14 h-14 ${stat.bg} ${stat.iconColor} rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all`}>
                <stat.icon size={28} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-all uppercase tracking-widest">
                    Gérer <ChevronRight size={12} />
                </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* REQUÊTES RÉCENTES LIÉES AU MODULE REQUESTS */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
               <Clock className="text-indigo-600" /> Requêtes prioritaires
            </h2>
            <Link href="/admin-dashboard/requests" className="text-[10px] font-black uppercase text-indigo-600 hover:underline">Ouvrir le support</Link>
          </div>
          
          <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
                {[1, 2].map((i) => (
                    <Link href="/admin-dashboard/requests" key={i} className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 tracking-tight">Paul Biya</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">Erreur de saisie note React</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                            <Send size={18} />
                        </div>
                    </Link>
                ))}
            </div>
          </div>
        </div>

        {/* ACTIONS RAPIDES CONNECTÉES */}
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight px-4">Actions</h2>
            
            <div className="grid grid-cols-1 gap-4">
               <Link href="/admin-dashboard/grades" className="w-full p-6 bg-slate-900 text-white rounded-[2rem] font-black text-left flex justify-between items-center group hover:bg-indigo-600 transition-all shadow-xl shadow-slate-100">
                  <span>Saisie des Notes</span>
                  <ArrowUpRight className="group-hover:translate-x-1 transition-transform" />
               </Link>
               
               <Link href="/admin-dashboard/students" className="w-full p-6 bg-white border border-slate-100 rounded-[2rem] font-black text-left flex justify-between items-center group hover:border-indigo-500 transition-all">
                  <span className="text-slate-800">Inscrire Étudiant</span>
                  <Users className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
               </Link>

               <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                  <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-2 italic">Guide de gestion</p>
                  <h4 className="text-xl font-black mb-4 leading-tight">Générer les bulletins de fin de semestre</h4>
                  <button className="px-6 py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black hover:scale-105 transition-all uppercase">Lancer l'export</button>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}