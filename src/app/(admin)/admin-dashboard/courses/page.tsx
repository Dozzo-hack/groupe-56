"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Save, Plus, Trash2, Loader2 } from 'lucide-react';

export default function AdminTimetablePage() {
  const [selectedDay, setSelectedDay] = useState("Lundi");
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  
  // États de données (depuis la BDD)
  const [classes, setClasses] = useState<any[]>([]);
  const [allModules, setAllModules] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedModule, setSelectedModule] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [formData, setFormData] = useState({ date: "", startTime: "", endTime: "", room: "" });

  // 1. Charger les Classes et Modules au montage
  useEffect(() => {
    fetch('/api/schedules')
      .then(res => res.json())
      .then(data => {
        setClasses(data.classes || []);
        setAllModules(data.modules || []);
        if (data.classes?.length > 0) setSelectedClass(data.classes[0]._id);
        setLoading(false);
      });
  }, []);

  // 2. Recharger l'emploi du temps quand la classe change
  useEffect(() => {
    if (!selectedClass) return;
    fetch(`/api/schedules?classId=${selectedClass}`)
      .then(res => res.json())
      .then(data => setSchedules(data || []));
      
    // Reset module quand on change de classe
    setSelectedModule("");
    setTeacherName("");
  }, [selectedClass]);

  // 3. Auto-remplir le nom du prof quand on choisit un module
  useEffect(() => {
    if (selectedModule) {
      const moduleInfo = allModules.find(m => m._id === selectedModule);
      if (moduleInfo) setTeacherName(moduleInfo.teacherName);
    } else {
      setTeacherName("");
    }
  }, [selectedModule, allModules]);

  // Modules filtrés pour la classe sélectionnée
  const filteredModules = allModules.filter(m => m.class === selectedClass);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedModule || !formData.date || !formData.startTime || !formData.endTime || !formData.room) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classId: selectedClass,
        moduleId: selectedModule,
        ...formData
      })
    });

    if (res.ok) {
      const newSchedule = await res.json();
      setSchedules([...schedules, newSchedule]);
      setFormData({ date: "", startTime: "", endTime: "", room: "" }); // Reset partiel
      alert("Cours programmé avec succès !");
    }
  };

  if (loading) return <div className="p-8 flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Gestion des Emplois du Temps</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">Organisez les plannings par classe.</p>
        </div>
        
        {/* SELECTEUR DE CLASSE GLOBAL (Remplace filière/niveau séparés) */}
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="w-full md:w-auto bg-white border border-slate-200 px-4 py-3 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        >
          {classes.map(c => (
            <option key={c._id} value={c._id}>{c.name} ({c.filiere})</option>
          ))}
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* FORMULAIRE D'AJOUT (Mobile First -> s'empile) */}
        <form onSubmit={handleSubmit} className="lg:col-span-1 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6 h-fit">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Plus className="text-blue-600" /> Programmer un cours
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Matière / Module</label>
              <select 
                value={selectedModule} 
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm"
              >
                <option value="">Sélectionner une matière...</option>
                {filteredModules.map(m => (
                  <option key={m._id} value={m._id}>{m.title} ({m.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Enseignant Affecté</label>
              <input 
                type="text" 
                readOnly 
                value={teacherName || "Sélectionnez un module d'abord"} 
                className="w-full p-3 bg-slate-100/50 text-slate-500 rounded-xl border-none outline-none font-bold text-sm" 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
              <input 
                type="date" 
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Heure de début</label>
                <input 
                  type="time" 
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Heure de fin</label>
                <input 
                  type="time" 
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm" 
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Salle</label>
              <input 
                type="text" 
                required
                placeholder="ex: Amphi 200" 
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                className="w-full p-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-100 font-bold text-sm" 
              />
            </div>

            <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2 mt-2">
              <Save size={18} /> Valider la programmation
            </button>
          </div>
        </form>

        {/* AFFICHAGE DES COURS */}
        <div className="lg:col-span-2 space-y-6">
          {/* Menu des Jours (Scrollable sur mobile) */}
          <div className="flex overflow-x-auto gap-2 p-1 bg-slate-100 rounded-2xl w-full no-scrollbar pb-2">
            {days.map(day => (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 md:px-6 py-2 rounded-xl font-black transition-all flex-shrink-0 text-sm md:text-base ${
                  selectedDay === day ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <h3 className="text-lg font-black text-slate-800">Programme du {selectedDay}</h3>
          
          <div className="space-y-4">
            {schedules.filter(s => s.day === selectedDay).length === 0 ? (
              <p className="text-slate-400 font-medium italic p-4 text-center bg-slate-50 rounded-2xl">Aucun cours programmé pour ce jour.</p>
            ) : (
              schedules.filter(s => s.day === selectedDay).map((item) => (
                <div key={item._id} className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group hover:border-blue-200 transition-all">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center w-full">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-sm w-fit">
                      {item.startTime} - {item.endTime}
                    </div>
                    <div>
                      {/* Affichage intelligent gérant l'objet populé ou non */}
                      <h4 className="font-black text-slate-900 text-base md:text-lg">{item.moduleId?.title || "Module inconnu"}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                        Le {new Date(item.date).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex flex-wrap gap-3 md:gap-4 mt-1">
                        <span className="flex items-center gap-1 text-slate-500 text-xs font-bold italic">
                          <MapPin size={14} /> {item.room}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500 text-xs font-bold italic">
                          <User size={14} /> {item.teacherName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end md:self-auto">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}