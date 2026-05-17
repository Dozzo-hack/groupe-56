"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, UserSquare2, ArrowRight, ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function TeacherLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Plus tard : Validation réelle avec la DB
    router.push('/teacher-dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* --- CÔTÉ GAUCHE : IDENTITÉ VISUELLE (Caché sur mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-indigo-700 p-16 flex-col justify-between relative overflow-hidden">
        {/* Décoration d'arrière-plan abstraite */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 bg-slate-900 rounded-full blur-2xl opacity-20" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 text-white group">
            <div className="p-2 bg-white/10 rounded-xl group-hover:bg-white/20 transition-colors">
              <GraduationCap size={28} />
            </div>
            <span className="text-xl font-black tracking-tighter italic uppercase">IUT Portal</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div className="inline-block px-4 py-1 bg-indigo-500/30 border border-indigo-400/30 rounded-full text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em]">
            Espace Pédagogique
          </div>
          <h2 className="text-6xl font-black text-white leading-[0.95] tracking-tighter italic">
            Pilotez vos <br /> 
            <span className="text-indigo-300">Enseignements.</span>
          </h2>
          <p className="text-indigo-100/80 font-bold text-lg max-w-md leading-relaxed">
            Gérez vos ressources, évaluez vos étudiants et suivez l'évolution de vos modules en un seul endroit.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-indigo-300/60 font-bold text-[10px] uppercase tracking-widest">
          <span>© 2026 Système de Gestion IUT</span>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition-colors">Aide</span>
            <span className="hover:text-white cursor-pointer transition-colors">Confidentialité</span>
          </div>
        </div>
      </div>

      {/* --- CÔTÉ DROIT : FORMULAIRE --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-24 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md space-y-10">
          
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600 transition-all group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Retour à l'accueil
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                <UserSquare2 size={28} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Enseignant</h3>
                <p className="text-slate-400 font-bold text-sm">Portail de gestion académique</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Email Professionnel</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl font-bold text-slate-700 outline-none transition-all"
                  placeholder="nom.prenom@iut-univ.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
                <a href="#" className="text-[10px] text-indigo-600 hover:underline font-black uppercase">Oublié ?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500 focus:bg-white rounded-3xl font-bold text-slate-700 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-5 px-4 bg-slate-900 text-white rounded-3xl font-black text-sm hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all duration-300"
            >
              SE CONNECTER AU DASHBOARD <ArrowRight size={20} />
            </button>
          </form>

          <div className="pt-8 border-t border-slate-100">
            <p className="text-center text-xs font-bold text-slate-400">
              Vous êtes un étudiant ?{" "}
              <Link href="/login/student" className="text-indigo-600 font-black hover:underline">
                Accéder au portail étudiant
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}