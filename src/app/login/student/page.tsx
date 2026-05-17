"use client"; // Composant interactif

import React, { useState } from 'react';
// Importation d'icônes simples pour le design (il faudra peut-être installer lucide-react plus tard)
import { User, Lock, Mail } from 'lucide-react'; 

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    // Fond avec un léger dégradé pour un look premium
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-blue-50">
      
      {/* Côté Gauche - Illustration et Texte (caché sur mobile) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 p-12 flex-col justify-between">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <User className="w-6 h-6" /> Portail Étudiant
        </h1>
        <div className="text-white space-y-4">
          <h2 className="text-5xl font-extrabold leading-tight">
            Connectez-vous à votre réussite.
          </h2>
          <p className="text-blue-100 text-lg max-w-md">
            Accédez à vos cours, consultez vos notes et communiquez facilement avec l'administration universitaire.
          </p>
        </div>
        <p className="text-blue-200 text-sm">© 2026 Université Numérique Internationale</p>
      </div>

      {/* Côté Droit - Formulaire de Connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          
          <div>
            {/* Logo de l'université (à remplacer par une vraie image) */}
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900">Espace Étudiant</h3>
            <p className="text-gray-500 mt-2">Veuillez entrer vos identifiants pour continuer.</p>
          </div>

          <form className="space-y-6">
            {/* Champ Email avec icône */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Adresse e-mail académique</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="nom.prenom@etudiant-uni.edu"
                />
              </div>
            </div>

            {/* Champ Mot de passe avec icône */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Mot de passe</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">Oublié ?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Bouton Se connecter stylisé */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                Se connecter à l'espace étudiant
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous êtes personnel administratif ?{" "}
              <a href="/login/admin" className="font-medium text-blue-600 hover:text-blue-500">
                Se connecter ici
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}