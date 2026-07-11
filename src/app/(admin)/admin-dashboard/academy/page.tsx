"use client";

import React, { useState, useEffect } from 'react';
import { School, BookOpen, Layers, Plus, Trash2, Loader2, Landmark, Check } from 'lucide-react';

export default function AdminAcademyManager() {
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulaires États
  const [classForm, setClassForm] = useState({ regime: 'FI', level: 1, filiere: '', group: 'A', classroom: '' });
  const [subjectForm, setSubjectForm] = useState({ name: '', code: '', filiere: '', level: 1 });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resClasses, resSubjects] = await Promise.all([
        fetch('/api/admin/classes'),
        fetch('/api/admin/subjects')
      ]);
      const dataClasses = await resClasses.json();
      const dataSubjects = await resSubjects.json();
      
      if (Array.isArray(dataClasses)) setClasses(dataClasses);
      if (Array.isArray(dataSubjects)) setSubjects(dataSubjects);
    } catch (err) {
      console.error("Erreur lors de la récupération des données :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.filiere || !classForm.classroom) {
      alert("Veuillez remplir tous les champs de la classe.");
      return;
    }
    try {
      const res = await fetch('/api/admin/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classForm)
      });
      
      const data = await res.json();

      if (res.ok) {
        setClassForm({ regime: 'FI', level: 1, filiere: '', group: 'A', classroom: '' });
        alert("Classe générée avec succès !");
        fetchData();
      } else {
        // Affiche l'erreur exacte renvoyée par l'API (ex: "Non autorisé", "Cette classe existe déjà")
        alert(data.message || "Une erreur est survenue lors de la création.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau ou connexion au serveur impossible.");
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name || !subjectForm.code || !subjectForm.filiere) {
      alert("Veuillez remplir tous les champs de la matière.");
      return;
    }
    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectForm)
      });

      const data = await res.json();

      if (res.ok) {
        setSubjectForm({ name: '', code: '', filiere: '', level: 1 });
        alert("Matière enregistrée avec succès !");
        fetchData();
      } else {
        alert(data.message || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau ou connexion au serveur impossible.");
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm('Supprimer cette classe définitivement ?')) return;
    try {
      const res = await fetch(`/api/admin/classes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      } else {
        const data = await res.json();
        alert(data.message || "Impossible de supprimer la classe.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* BANNER HEADER */}
      <div className="bg-slate-900 text-white p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black italic tracking-tight">Configuration IUT</h1>
          <p className="text-slate-400 text-xs sm:text-sm font-bold mt-1">Gérer la hiérarchie structurelle globale de l'établissement</p>
        </div>
        <div className="flex gap-2 bg-white/5 p-1.5 rounded-xl border border-white/10 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('classes')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-black text-xs transition-all ${activeTab === 'classes' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-white/5'}`}
          >
            <School size={14} /> Classes
          </button>
          <button 
            onClick={() => setActiveTab('subjects')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-black text-xs transition-all ${activeTab === 'subjects' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-300 hover:bg-white/5'}`}
          >
            <BookOpen size={14} /> Matières
          </button>
        </div>
      </div>

      {/* DYNAMIC VIEW CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* LEFT COLUMN: CONTEXTUAL FORM */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 italic">
              {activeTab === 'classes' ? 'Ajouter une Classe' : 'Enregistrer une Matière'}
            </h2>
            <p className="text-slate-400 text-xs font-bold">Remplir les critères requis en base de données</p>
          </div>

          {activeTab === 'classes' ? (
            <form onSubmit={handleAddClass} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Régime</label>
                  <select 
                    value={classForm.regime}
                    onChange={(e: any) => setClassForm({ ...classForm, regime: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500"
                  >
                    <option value="FI">Jour (FI)</option>
                    <option value="FA">Soir (FA)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Niveau</label>
                  <select 
                    value={classForm.level}
                    onChange={(e: any) => setClassForm({ ...classForm, level: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>Niveau {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Nom de la Filière</label>
                <input 
                  type="text"
                  placeholder="ex: Génie Informatique"
                  value={classForm.filiere}
                  onChange={(e) => setClassForm({ ...classForm, filiere: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Groupe / Division</label>
                  <input 
                    type="text"
                    maxLength={1}
                    placeholder="ex: A"
                    value={classForm.group}
                    onChange={(e) => setClassForm({ ...classForm, group: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-center text-sm uppercase outline-none focus:ring-2 ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Salle Assignée</label>
                  <input 
                    type="text"
                    placeholder="ex: Amphi 200"
                    value={classForm.classroom}
                    onChange={(e) => setClassForm({ ...classForm, classroom: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Générer la Classe
              </button>
            </form>
          ) : (
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Libellé Matière</label>
                <input 
                  type="text"
                  placeholder="ex: Algorithmique Avancée"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Code Unique</label>
                  <input 
                    type="text"
                    placeholder="ex: ALGO-AV-3"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({ ...subjectForm, code: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm uppercase outline-none focus:ring-2 ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Niveau d'études</label>
                  <select 
                    value={subjectForm.level}
                    onChange={(e: any) => setSubjectForm({ ...subjectForm, level: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500"
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>Niveau {n}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1 block mb-1">Filière / Spécialisation</label>
                <input 
                  type="text"
                  placeholder="ex: Génie Informatique"
                  value={subjectForm.filiere}
                  onChange={(e) => setSubjectForm({ ...subjectForm, filiere: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm outline-none focus:ring-2 ring-indigo-500"
                />
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <Plus size={16} /> Enregistrer la Matière
              </button>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: LISTING */}
        <div className="lg:col-span-2 space-y-4 max-h-[80vh] overflow-y-auto pr-1">
          {activeTab === 'classes' ? (
            classes.length > 0 ? (
              classes.map((cls) => (
                <div key={cls._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4 group hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-4 truncate">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs tracking-tight shrink-0">
                      {cls.name.split('-')[0]}
                    </div>
                    <div className="truncate">
                      <h4 className="font-black text-slate-900 text-base leading-tight">{cls.name}</h4>
                      <p className="text-slate-400 font-bold text-xs truncate mt-0.5">
                        {cls.filiere} • <span className="text-indigo-600 italic font-black">{cls.classroom}</span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteClass(cls._id)}
                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-sm font-bold text-slate-400 bg-white rounded-2xl border border-slate-100">Aucune classe configurée pour le moment.</p>
            )
          ) : (
            subjects.length > 0 ? (
              subjects.map((sub) => (
                <div key={sub._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 truncate">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-[10px] shrink-0">
                      {sub.code}
                    </div>
                    <div className="truncate">
                      <h4 className="font-black text-slate-900 text-base leading-tight truncate">{sub.name}</h4>
                      <p className="text-slate-400 font-bold text-xs truncate mt-0.5">
                        Filière : {sub.filiere} • <span className="text-slate-900 font-extrabold">Niveau {sub.level}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-sm font-bold text-slate-400 bg-white rounded-2xl border border-slate-100">Aucune matière répertoriée dans le catalogue.</p>
            )
          )}
        </div>

      </div>

    </div>
  );
}