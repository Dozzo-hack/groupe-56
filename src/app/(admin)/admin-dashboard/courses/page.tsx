"use client";

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Save, Plus, Trash2 } from 'lucide-react';

export default function AdminTimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Lundi");
  
  // Simulation des cours déjà programmés
  const [schedule, setSchedule] = useState([
    { id: 1, day: "Lundi", time: "08:00 - 10:00", subject: "Algorithmique", room: "Salle 102", teacher: "Dr. Tanon" },
    { id: 2, day: "Lundi", time: "10:30 - 12:30", subject: "Base de Données", room: "Labo Info", teacher: "Mme Eteki" },
  ]);

  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Gestion des Emplois du Temps</h1>
          <p className="text-slate-500 font-medium">Organisez les plannings par filière et niveau.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Génie Logiciel</option>
            <option>Réseaux & Télécoms</option>
          </select>
          <select className="bg-white border border-slate-200 px-4 py-2 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Niveau 3</option>
            <option>Niveau 2</option>
          </select>
        </div>
      </div>

      {/* Sélecteur de Jour */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
        {days.map(day => (
          <button 
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-2 rounded-xl font-black transition-all ${
              selectedDay === day ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulaire d'ajout */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 h-fit">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Plus className="text-blue-600" /> Ajouter un créneau
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Heure</label>
              <input type="text" placeholder="ex: 08:00 - 10:00" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Matière</label>
              <input type="text" placeholder="Nom du cours" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Salle</label>
                <input type="text" placeholder="ex: Amphi 200" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Enseignant</label>
                <input type="text" placeholder="Nom du prof" className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold" />
              </div>
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2">
              <Save size={18} /> Publier le cours
            </button>
          </div>
        </div>

        {/* Liste des cours du jour sélectionné */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-black text-slate-800">Programme du {selectedDay}</h3>
          
          {schedule.filter(s => s.day === selectedDay).map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="flex gap-6 items-center">
                <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-sm">
                  {item.time}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg">{item.subject}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="flex items-center gap-1 text-slate-400 text-xs font-bold italic">
                      <MapPin size={14} /> {item.room}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400 text-xs font-bold italic">
                      <User size={14} /> {item.teacher}
                    </span>
                  </div>
                </div>
              </div>
              <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}