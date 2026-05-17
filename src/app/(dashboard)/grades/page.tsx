"use client";

import React from 'react';
import { Award, Book, GraduationCap, ChevronRight } from 'lucide-react';

export default function GradesPage() {
  // Structure de données type IUT / Licence Info
  const semesters = [
    {
      id: "S1",
      label: "Semestre 1 - Informatique Fondamentale",
      totalCredits: 30,
      average: 14.85,
      ues: [
        {
          name: "UE 1.1 : Bases de l'informatique",
          credits: 12,
          modules: [
            { name: "Introduction aux Systèmes", grade: 14, coeff: 3 },
            { name: "Algorithmique & Programmation 1", grade: 16, coeff: 5 },
            { name: "Structures de données", grade: 13.5, coeff: 4 }
          ]
        },
        {
          name: "UE 1.2 : Mathématiques & Économie",
          credits: 9,
          modules: [
            { name: "Mathématiques Discrètes", grade: 12, coeff: 4 },
            { name: "Algèbre Linéaire", grade: 15, coeff: 3 },
            { name: "Économie du numérique", grade: 14, coeff: 2 }
          ]
        },
        {
          name: "UE 1.3 : Communication & Anglais",
          credits: 9,
          modules: [
            { name: "Anglais Technique", grade: 17, coeff: 4 },
            { name: "Expression & Communication", grade: 15.5, coeff: 5 }
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Relevé de Notes</h1>
          <p className="text-gray-500 font-medium italic">Année Universitaire 2025-2026</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-xl text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Moyenne Générale</p>
            <p className="text-xl font-black text-blue-600">14.85 / 20</p>
          </div>
        </div>
      </div>

      {semesters.map((semester) => (
        <div key={semester.id} className="space-y-6">
          <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
            <ChevronRight className="text-blue-600" /> {semester.label}
          </h2>

          {semester.ues.map((ue, ueIndex) => (
            <div key={ueIndex} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              {/* Entête de l'UE */}
              <div className="bg-gray-50/80 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-gray-800 uppercase text-sm tracking-widest">{ue.name}</h3>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                  {ue.credits} ECTS
                </span>
              </div>

              {/* Liste des modules de l'UE */}
              <div className="divide-y divide-gray-50">
                {ue.modules.map((module, modIndex) => (
                  <div key={modIndex} className="px-8 py-5 flex items-center justify-between hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        <Book size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{module.name}</p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Coefficient : {module.coeff}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className={`text-lg font-black ${module.grade >= 10 ? 'text-gray-900' : 'text-red-500'}`}>
                          {module.grade.toFixed(2)}
                        </span>
                        <span className="text-gray-300 text-xs ml-1">/ 20</span>
                      </div>
                      {/* Petit badge de validation */}
                      <div className={`h-2 w-2 rounded-full ${module.grade >= 10 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}