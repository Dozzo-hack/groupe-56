"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'; 

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(false);

    // Petite sécurité front supplémentaire
    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse e-mail académique valide.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'student' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue lors de la connexion.');
      }

      // 🟢 État : Connexion Validée !
      setSuccess(true);
      
      // On laisse le design vert s'afficher 800ms pour une transition fluide avant redirection
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);

    } catch (err: any) {
      // 🔴 État : Erreur d'identifiants
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
      
      {/* Côté Gauche - Illustration et Texte (caché sur mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 z-10">
          <User className="w-6 h-6" /> Portail Étudiant
        </h1>
        
        <div className="text-white space-y-4 z-10">
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight">
            Connectez-vous à <br />votre réussite.
          </h2>
          <p className="text-blue-100 text-lg max-w-md font-medium opacity-90">
            Accédez à vos cours, consultez vos notes et communiquez facilement avec l'administration universitaire.
          </p>
        </div>
        <p className="text-blue-200 text-sm z-10 font-medium">© 2026 Université Numérique Internationale</p>
      </div>

      {/* Côté Droit - Formulaire de Connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100 transition-all duration-300">
          
          <div>
            {/* Logo dynamique changeant de couleur selon l'état */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${
              success ? 'bg-green-100 text-green-600' : error ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {success ? <CheckCircle2 className="w-9 h-9" /> : error ? <AlertCircle className="w-9 h-9" /> : <Mail className="w-9 h-9" />}
            </div>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Espace Étudiant</h3>
            <p className="text-gray-500 mt-2 font-medium text-sm">Veuillez entrer vos identifiants pour continuer.</p>
          </div>

          {/* Alertes d'état stylisées */}
          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-50 rounded-xl font-semibold border border-red-100 flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 text-sm text-green-700 bg-green-50 rounded-xl font-semibold border border-green-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />
              <span>Authentification réussie ! Redirection en cours...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Champ Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Adresse e-mail académique</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="email"
                  required
                  disabled={loading || success}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl font-medium text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-60 ${
                    error 
                      ? 'border-red-300 bg-red-50/30 focus:ring-red-500 focus:border-red-500' 
                      : success 
                      ? 'border-green-300 bg-green-50/30 focus:ring-green-500 focus:border-green-500' 
                      : 'border-gray-200 bg-gray-50/30 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="nom.prenom@etudiant-uni.edu"
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600">Mot de passe</label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-bold tracking-tight">Oublié ?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
                <input
                  type="password"
                  required
                  disabled={loading || success}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl font-medium text-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-60 ${
                    error 
                      ? 'border-red-300 bg-red-50/30 focus:ring-red-500 focus:border-red-500' 
                      : success 
                      ? 'border-green-300 bg-green-50/30 focus:ring-green-500 focus:border-green-500' 
                      : 'border-gray-200 bg-gray-50/30 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Bouton de Soumission */}
            <div>
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white uppercase tracking-widest transition-all duration-150 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none ${
                  success 
                    ? 'bg-green-600' 
                    : error 
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Vérification...
                  </>
                ) : success ? (
                  "Accès accordé"
                ) : (
                  "Se connecter à l'espace étudiant"
                )}
              </button>
            </div>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Vous êtes personnel administratif ?{" "}
              <a href="/login/admin" className="text-blue-600 hover:text-blue-700 transition-colors">
                Se connecter ici
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}