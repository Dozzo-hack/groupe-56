"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Fingerprint, ArrowRight, ArrowLeft, Terminal, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'admin' }), // Spécification du rôle admin pour cibler la bonne collection
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Clé de sécurité ou identifiant invalide.');
      }

      // 🟢 Authentification réussie
      setSuccess(true);

      // Temporisation pour apprécier l'effet de validation du terminal avant redirection
      setTimeout(() => {
        router.push('/admin-dashboard');
        router.refresh();
      }, 800);

    } catch (err: any) {
      // 🔴 Échec d'authentification
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a] font-sans overflow-hidden">
      
      {/* --- CÔTÉ GAUCHE : SÉCURITÉ & STATS (Caché sur mobile) --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-950 p-20 flex-col justify-between relative">
        {/* Effet de grille technologique en fond */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ 
            backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', 
            backgroundSize: '24px 24px'
          }} 
        />
        <div className="relative z-10">
          <div className={`flex items-center gap-3 transition-colors duration-300 ${
            success ? 'text-emerald-500' : error ? 'text-red-500' : 'text-amber-500'
          }`}>
            <ShieldCheck size={32} />
            <span className="text-xl font-black tracking-widest uppercase">Admin Terminal</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3">
            <div className={`h-[2px] w-12 transition-colors ${success ? 'bg-emerald-500' : error ? 'bg-red-500' : 'bg-amber-500'}`} />
            <span className={`font-black text-xs uppercase tracking-[0.3em] ${success ? 'text-emerald-500' : error ? 'text-red-500' : 'text-amber-500'}`}>
              {success ? "Accès Autorisé" : error ? "Alerte Brèche" : "Accès Restreint"}
            </span>
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

          {/* États du terminal de contrôle (Erreurs / Succès) */}
          {error && (
            <div className="p-5 text-xs text-red-400 bg-red-950/30 rounded-2xl font-mono uppercase tracking-wider border border-red-900/50 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>[CRITICAL_ERROR]: {error}</span>
            </div>
          )}

          {success && (
            <div className="p-5 text-xs text-emerald-400 bg-emerald-950/30 rounded-2xl font-mono uppercase tracking-wider border border-emerald-900/50 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
              <span>[SUCCESS]: Session validée. Initialisation...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Champ Identifiant (Email) */}
            <div className="space-y-2">
              <div className="relative group">
                <Fingerprint className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                  error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-slate-600 group-focus-within:text-amber-500'
                }`} size={20} />
                <input
                  type="email"
                  required
                  disabled={loading || success}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-14 pr-6 py-5 rounded-2xl font-bold text-white outline-none transition-all border-2 bg-slate-800/50 placeholder:text-slate-600 ${
                    error 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : success 
                      ? 'border-emerald-500/50 focus:border-emerald-500' 
                      : 'border-slate-700 focus:border-amber-500 focus:bg-slate-800'
                  }`}
                  placeholder="ID Administrateur (Email)"
                />
              </div>
            </div>

            {/* Champ Mot de passe (Clé de sécurité) */}
            <div className="space-y-2">
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                  error ? 'text-red-500' : success ? 'text-emerald-500' : 'text-slate-600 group-focus-within:text-amber-500'
                }`} size={20} />
                <input
                  type="password"
                  required
                  disabled={loading || success}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-14 pr-6 py-5 rounded-2xl font-bold text-white outline-none transition-all border-2 bg-slate-800/50 placeholder:text-slate-600 ${
                    error 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : success 
                      ? 'border-emerald-500/50 focus:border-emerald-500' 
                      : 'border-slate-700 focus:border-amber-500 focus:bg-slate-800'
                  }`}
                  placeholder="Clé de sécurité"
                />
              </div>
            </div>

            {/* Bouton d'action */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex items-center justify-center gap-3 py-5 px-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-300 active:scale-[0.98] disabled:opacity-40 ${
                success 
                  ? 'bg-emerald-600 text-white' 
                  : error 
                  ? 'bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.2)]' 
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  DÉCHIFFREMENT EN COURS...
                </>
              ) : success ? (
                "SESSION SPECTRE VALIDE"
              ) : (
                <>
                  INITIALISER LA SESSION <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-8">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              L'accès non autorisé est strictement surveillé et journalisé.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}