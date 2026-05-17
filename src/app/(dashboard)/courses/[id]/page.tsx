"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  ArrowLeft 
} from 'lucide-react';

export default function CourseDetailPage() {
  // Liste des ressources
  const [resources, setResources] = useState([
    { id: 1, title: "Cours magistral - Chapitre 1", type: "PDF", viewed: false },
    { id: 2, title: "Exercices d'application", type: "PDF", viewed: false },
    { id: 3, title: "Devoir à rendre - Devoir n°1", type: "DOCX", viewed: false },
    { id: 4, title: "Support vidéo", type: "MP4", viewed: false },
  ]);

  // Calcul de la progression
  const viewedCount = resources.filter(r => r.viewed).length;
  const progress = (viewedCount / resources.length) * 100;

  const toggleViewed = (id: number) => {
    setResources(resources.map(r => r.id === id ? { ...r, viewed: true } : r));
  };

  return (
    <div className="space-y-8">
      {/* BOUTON RETOUR */}
      <Link 
        href="/courses" 
        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors group"
      >
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-blue-200">
          <ArrowLeft size={20} />
        </div>
        Retour aux cours
      </Link>

      {/* HEADER DU COURS */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900">Algorithmique & Programmation 1</h1>
        <p className="text-gray-500 mt-2 font-medium">Dr. Diallo • Semestre 1 • UE 1.1</p>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2 font-bold">
            <span className="text-gray-500 uppercase tracking-wider">Progression dans ce module</span>
            <span className="text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </div>

      {/* CONTENU DU COURS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Liste des PDF */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black mb-6 text-gray-800">Supports de cours</h3>
          <div className="space-y-4">
            {resources.map((res) => (
              <div 
                key={res.id} 
                onClick={() => toggleViewed(res.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                  res.viewed 
                    ? "bg-green-50 border-green-100 shadow-sm" 
                    : "bg-gray-50 border-gray-100 hover:border-blue-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${res.viewed ? "bg-green-100 text-green-600" : "bg-white text-gray-400"}`}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className={`font-bold ${res.viewed ? "text-green-800" : "text-gray-700"}`}>{res.title}</p>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{res.type}</p>
                  </div>
                </div>
                {res.viewed ? <CheckCircle className="text-green-600" /> : <Download className="text-gray-400" size={18} />}
              </div>
            ))}
          </div>
        </div>

        {/* Section Devoirs */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-lg font-black mb-6 text-red-600">Espace Devoirs</h3>
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-800">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-red-600" />
              <p className="font-black italic">Deadline : 15 Mai 2026</p>
            </div>
            <p className="text-sm font-medium mb-6">
              Veuillez soumettre vos TP d'algorithmique ici. Seul le format PDF est accepté.
            </p>
            <button className="w-full bg-red-600 text-white font-black py-4 rounded-xl hover:bg-red-700 transition-all hover:shadow-lg hover:shadow-red-200">
              Déposer mon fichier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}