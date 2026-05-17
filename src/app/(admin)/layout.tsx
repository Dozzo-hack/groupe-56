"use client";
import React from 'react';
import Link from 'next/link';
import { 
    LayoutDashboard, 
    Users, 
    FileText, 
    LogOut, 
    ShieldCheck, 
    ClipboardCheck,
    BookOpen, 
    Award      
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* SIDEBAR ADMIN */}
      <aside className="w-72 bg-slate-900 text-white p-6 flex flex-col shadow-2xl fixed h-screen">
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="bg-red-600 p-2 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">ESPACE ADMIN</span>
        </div>

        {/* Remplace ton bloc <nav> par celui-ci qui est plus "pro" au niveau des clics */}
<nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-2">Principal</p>
  <Link href="/admin-dashboard" className="flex items-center gap-3 p-4 bg-blue-600 rounded-2xl font-bold transition text-white shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-95">
    <LayoutDashboard size={20} /> Vue d'ensemble
  </Link>

  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mt-6 mb-2">Scolarité</p>
  
  <Link href="/admin-dashboard/students" className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-2xl font-bold transition text-slate-400 hover:text-white group">
    <Users size={20} className="group-hover:text-blue-400 transition-colors" /> Liste des Étudiants
  </Link>

  <Link href="/admin-dashboard/courses" className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-2xl font-bold transition text-slate-400 hover:text-white group">
    <BookOpen size={20} className="group-hover:text-blue-400 transition-colors" /> Gestion des Cours
  </Link>

  <Link href="/admin-dashboard/grades" className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-2xl font-bold transition text-slate-400 hover:text-white group">
    <Award size={20} className="group-hover:text-blue-400 transition-colors" /> Saisie des Notes
  </Link>

  {/* Vérifie bien que le chemin /admin-dashboard/attendance existe dans tes dossiers */}
  <Link href="/admin-dashboard/attendance" className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-2xl font-bold transition text-slate-400 hover:text-white group">
    <ClipboardCheck size={20} className="group-hover:text-blue-400 transition-colors" /> Suivi des Présences
  </Link>

  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mt-6 mb-2">Support</p>
  <Link href="/admin-dashboard/requests" className="flex items-center gap-3 p-4 hover:bg-white/5 rounded-2xl font-bold transition text-slate-400 hover:text-white group">
    <FileText size={20} className="group-hover:text-blue-400 transition-colors" /> Requêtes & Tickets
    <span className="ml-auto bg-red-600 text-[10px] px-2 py-0.5 rounded-full text-white animate-pulse">12</span>
  </Link>
</nav>

        <button className="flex items-center gap-3 p-4 text-red-400 font-bold hover:bg-red-500/10 rounded-2xl transition mt-auto">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* CONTENU PRINCIPAL - On ajoute ml-72 pour ne pas être sous la sidebar */}
      <main className="flex-1 ml-72 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}