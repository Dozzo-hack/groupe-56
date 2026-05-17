"use client";

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function AdminAttendance() {
  // Simulation de la structure hiérarchique
  const departments = [
    {
      name: "Génie Informatique",
      classes: [
        { id: "L3-INFO", name: "Licence 3", totalStudents: 45, avgAttendance: "88%", status: "Normal" },
        { id: "L2-INFO", name: "Licence 2", totalStudents: 52, avgAttendance: "65%", status: "Alerte" },
      ]
    },
    {
      name: "Génie Civil",
      classes: [
        { id: "L1-CIV", name: "Licence 1", totalStudents: 120, avgAttendance: "92%", status: "Excellent" },
      ]
    }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Supervision des Présences</h1>
          <p className="text-slate-500 font-medium">Contrôle global de l'assiduité par département</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl">
          <Calendar className="text-indigo-600 ml-2" size={20} />
          <span className="font-black text-slate-700 pr-4">Semestre 1 - 2026</span>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher une classe, un prof ou un étudiant..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none focus:border-indigo-500 shadow-sm font-medium transition-all"
          />
        </div>
        <button className="bg-white p-4 rounded-2xl border border-slate-100 text-slate-600 hover:text-indigo-600 transition-all shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Rendu Hiérarchique */}
      <div className="space-y-10">
        {departments.map((dept, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2 px-2">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              {dept.name}
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dept.classes.map((cls) => (
                <div key={cls.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl text-indigo-600 font-black text-sm">
                      {cls.id}
                    </div>
                    {cls.status === "Alerte" ? (
                      <span className="flex items-center gap-1 text-red-500 font-black text-[10px] uppercase bg-red-50 px-3 py-1 rounded-full">
                        <AlertTriangle size={12} /> {cls.status}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-500 font-black text-[10px] uppercase bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle size={12} /> {cls.status}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900 mb-1">{cls.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-6">
                    <Users size={14} /> {cls.totalStudents} Étudiants inscrits
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Taux de présence</span>
                      <span className={`text-xl font-black ${cls.status === "Alerte" ? "text-red-600" : "text-indigo-600"}`}>
                        {cls.avgAttendance}
                      </span>
                    </div>
                    {/* Barre de progression */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${cls.status === "Alerte" ? "bg-red-500" : "bg-indigo-600"}`}
                        style={{ width: cls.avgAttendance }}
                      ></div>
                    </div>
                  </div>

                  <button className="w-full mt-6 py-3 bg-slate-50 text-slate-600 rounded-xl font-black text-xs flex items-center justify-center gap-2 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    Détails par matière <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}