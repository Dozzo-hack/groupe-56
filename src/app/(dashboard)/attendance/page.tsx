"use client";

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar as CalendarIcon, 
  ArrowLeft,
  Search
} from 'lucide-react';
import Link from 'next/link';

export default function AttendancePage() {
  const attendanceData = [
    { subject: "Base de Données", total: 20, present: 18, absent: 2, late: 0, status: "Normal" },
    { subject: "Mathématiques", total: 15, present: 15, absent: 0, late: 0, status: "Parfait" },
    { subject: "Algorithmique", total: 22, present: 20, absent: 1, late: 1, status: "Normal" },
    { subject: "Anglais Tech", total: 10, present: 8, absent: 2, late: 0, status: "Attention" },
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      
      {/* Header avec bouton retour rapide au Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">Présences</h1>
          </div>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] ml-11">
            Suivi d'assiduité • Semestre 2
          </p>
        </div>

        <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher une matière..." 
              className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 ring-indigo-500/20 transition-all w-full md:w-64 shadow-sm"
            />
        </div>
      </div>

      {/* Cartes de Stats Flash */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Taux Global", value: "92%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Absences", value: "05", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Retards", value: "01", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
              <stat.icon size={28} />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Liste des matières */}
      <div className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50">
           <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <CalendarIcon size={22} className="text-indigo-600" /> Détail par module
           </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">Matière</th>
                <th className="px-10 py-6 text-center">Cours Totaux</th>
                <th className="px-10 py-6 text-center text-green-600">Présences</th>
                <th className="px-10 py-6 text-center text-red-600">Absences</th>
                <th className="px-10 py-6">État</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {attendanceData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-10 py-8">
                    <p className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{item.subject}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic">Code: {item.subject.substring(0,3).toUpperCase()}-2026</p>
                  </td>
                  <td className="px-10 py-8 text-center font-black text-slate-400">{item.total}</td>
                  <td className="px-10 py-8 text-center">
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-xs font-black shadow-sm shadow-green-50">
                      {item.present}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <span className={`px-4 py-2 rounded-xl text-xs font-black ${item.absent > 0 ? 'bg-red-100 text-red-700 shadow-sm shadow-red-50' : 'bg-slate-100 text-slate-400'}`}>
                      {item.absent}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full animate-pulse ${item.status === 'Parfait' ? 'bg-green-500' : item.status === 'Attention' ? 'bg-red-500' : 'bg-blue-500'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note d'information */}
      <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 flex items-start gap-4">
          <AlertCircle className="text-indigo-600 shrink-0" size={24} />
          <p className="text-sm font-bold text-indigo-900 leading-relaxed italic">
            Au-delà de 3 absences non justifiées dans un même module, vous risquez une invalidation de l'UE. 
            En cas d'erreur, veuillez soumettre une <Link href="/dashboard/tickets" className="underline font-black hover:text-indigo-600 transition-colors">requête administrative</Link>.
          </p>
      </div>
    </div>
  );
}