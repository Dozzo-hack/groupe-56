"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Fingerprint, ArrowRight, ArrowLeft, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation de redirection vers le dashboard admin
    router.push('/admin-dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] font-sans overflow-hidden">
      
      {/* --- CÔTÉ GAUCHE : SÉCURITÉ & STATS (Caché sur mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 p-20 flex-col justify-between relative">
       {/* Effet de grille technologique en fond - Corrigé */}
<div 
  className="absolute inset-0 opacity-10" 
  style={{ 
    backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', 
    backgroundSize: '24px 24px' // On utilise backgroundSize à la place de size
  }} 
/>
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-amber-500">
            <ShieldCheck size={32} />
            <span className="text-xl font-black tracking-widest uppercase">Admin Terminal</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-12 bg-amber-500"></div>
            <span className="text-amber-500 font-black text-xs uppercase tracking-[0.3em]">Accès Restreint</span>
          </div>
          <h2 className="text-7xl font-black text-white leading-none tracking-tighter">
            Contrôle <br /> 
            <span className="text-slate-500">Central.</span>
          </h2>
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="border-l-2 border-slate-800 pl-6">
              <p className="text-2xl font-black text-white italic">2026</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Année Académique</p>
            </div>
            <div className="border-l-2 border-slate-800 pl-6">
              <p className="text-2xl font-black text-white italic">V3.0</p>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Version Système</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em]">
          <Terminal size={14} />
          <span>System Status: Online / Encrypted</span>
        </div>
      </div>

      {/* --- CÔTÉ DROIT : AUTHENTIFICATION --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-900">
        <div className="w-full max-w-md space-y-12">
          
          <div className="text-center lg:text-left space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase hover:text-amber-500 transition-all">
              <ArrowLeft size={14} /> Quitter la zone sécurisée
            </Link>
            <h3 className="text-4xl font-black text-white tracking-tighter italic">Authentification</h3>
            <p className="text-slate-500 font-bold text-sm">Entrez vos clés d'accès administrateur</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Fingerprint className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="block w-full pl-14 pr-6 py-5 bg-slate-800/50 border-2 border-slate-700 focus:border-amber-500 focus:bg-slate-800 rounded-2xl font-bold text-white outline-none transition-all placeholder:text-slate-600"
                  placeholder="ID Administrateur"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-amber-500 transition-colors" size={20} />
                <input
                  type="password"
                  required
                  className="block w-full pl-14 pr-6 py-5 bg-slate-800/50 border-2 border-slate-700 focus:border-amber-500 focus:bg-slate-800 rounded-2xl font-bold text-white outline-none transition-all placeholder:text-slate-600"
                  placeholder="Clé de sécurité"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-5 px-4 bg-amber-500 text-slate-950 rounded-2xl font-black text-sm hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all duration-300"
            >
              INITIALISER LA SESSION <ArrowRight size={20} />
            </button>
          </form>

          <div className="text-center pt-8">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              L'accès non autorisé est strictement surveillé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}