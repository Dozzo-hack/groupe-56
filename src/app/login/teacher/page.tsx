"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, UserSquare2, ArrowRight, ArrowLeft, GraduationCap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function TeacherLoginPage() {
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
        body: JSON.stringify({ email, password, role: 'teacher' }), // Rôle enseignant configuré pour le modèle Teacher
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue.');
      }

      // 🟢 Succès : On active l'état vert
      setSuccess(true);

      // Petite pause pour laisser l'animation de validation s'afficher à l'écran
      setTimeout(() => {
        router.push('/teacher-dashboard');
        router.refresh();
      }, 800);

    } catch (err: any) {
      // 🔴 Erreur : Identifiants invalides ou problème serveur
      setError(err.message);
      setLoading(false);
    }
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
            Gerez vos ressources, évaluez vos étudiants et suivez l'évolution de vos modules en un seul endroit.
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
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-colors duration-300 ${
                success ? 'bg-green-100 text-green-600' : error ? 'bg-red-100 text-red-600' : 'bg-indigo-50 text-indigo-600'
              }`}>
                {success ? <CheckCircle2 size={28} /> : error ? <AlertCircle size={28} /> : <UserSquare2 size={28} />}
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Enseignant</h3>
                <p className="text-slate-400 font-bold text-sm">Portail de gestion académique</p>
              </div>
            </div>
          </div>

          {/* Messages de retour d'état (Animations fluides) */}
          {error && (
            <div className="p-5 text-xs text-red-700 bg-red-50 rounded-3xl font-black uppercase tracking-wider border border-red-100 flex items-center gap-3 animate-bounce-short">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-5 text-xs text-green-700 bg-green-50 rounded-3xl font-black uppercase tracking-wider border border-green-100 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />
              <span>Accès vérifié. Connexion en cours...</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Champ Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Email Professionnel</label>
              <div className="relative group">
                <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                  error ? 'text-red-400' : success ? 'text-green-400' : 'text-slate-300 group-focus-within:text-indigo-500'
                }`} size={20} />
                <input
                  type="email"
                  required
                  disabled={loading || success}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-14 pr-6 py-5 rounded-3xl font-bold text-slate-700 outline-none transition-all border-2 disabled:opacity-60 ${
                    error 
                      ? 'border-red-500 bg-red-50/20' 
                      : success 
                      ? 'border-green-500 bg-green-50/20' 
                      : 'bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white'
                  }`}
                  placeholder="nom.prenom@iut-univ.com"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mot de passe</label>
                <a href="#" className="text-[10px] text-indigo-600 hover:underline font-black uppercase">Oublié ?</a>
              </div>
              <div className="relative group">
                <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                  error ? 'text-red-400' : success ? 'text-green-400' : 'text-slate-300 group-focus-within:text-indigo-500'
                }`} size={20} />
                <input
                  type="password"
                  required
                  disabled={loading || success}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-14 pr-6 py-5 rounded-3xl font-bold text-slate-700 outline-none transition-all border-2 disabled:opacity-60 ${
                    error 
                      ? 'border-red-500 bg-red-50/20' 
                      : success 
                      ? 'border-green-500 bg-green-50/20' 
                      : 'bg-slate-50 border-transparent focus:border-indigo-500 focus:bg-white'
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Bouton Soumettre dynamique */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full flex items-center justify-center gap-3 py-5 px-4 rounded-3xl font-black text-sm uppercase tracking-wider transition-all duration-300 active:scale-[0.98] disabled:opacity-50 ${
                success 
                  ? 'bg-green-600 text-white' 
                  : error 
                  ? 'bg-red-600 text-white shadow-2xl shadow-red-100' 
                  : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  VÉRIFICATION DES ACCÈS...
                </>
              ) : success ? (
                "ACCÈS ACCORDÉ"
              ) : (
                <>
                  SE CONNECTER AU DASHBOARD <ArrowRight size={20} />
                </>
              )}
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