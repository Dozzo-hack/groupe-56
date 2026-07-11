"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, UserCheck, UserX, BookOpen, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: string;
  name: string;
  matricule: string;
  status: 'present' | 'absent';
}

interface ModuleData {
  _id: string;
  title: string;
  classCode: string;
  code: string; // Représente le subjectCode dans ta logique
}

export default function TeacherAttendancePage() {
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingModules, setLoadingModules] = useState<boolean>(true);
  const [loadingStudents, setLoadingStudents] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // 1. Récupération des modules du prof à l'ouverture de la page
  useEffect(() => {
    const fetchTeacherModules = async () => {
      try {
        const res = await fetch('/api/teacher/modules');
        if (res.ok) {
          const data = await res.json();
          setModules(data);
          // Sélectionner automatiquement le premier module de la liste
          if (data.length > 0) setSelectedModule(data[0]);
        }
      } catch (err) {
        console.error("Erreur de récupération des modules", err);
      } finally {
        setLoadingModules(false);
      }
    };
    fetchTeacherModules();
  }, []);

  // 2. Mise à jour de la liste d'appel dès que le module sélectionné change
  useEffect(() => {
    const fetchClassRoll = async (classCode: string) => {
      setLoadingStudents(true);
      try {
        const res = await fetch(`/api/teacher/attendance/roll?classCode=${classCode}`);
        if (res.ok) {
          const data = await res.json();
          // Statut par défaut configuré sur 'present'
          setStudents(data.map((s: any) => ({ ...s, status: 'present' })));
        }
      } catch (err) {
        console.error("Erreur de récupération de la liste d'appel", err);
      } finally {
        setLoadingStudents(false);
      }
    };

    if (selectedModule) {
      fetchClassRoll(selectedModule.classCode);
    }
  }, [selectedModule]);

  const toggleStatus = (id: string, currentStatus: 'present' | 'absent') => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: currentStatus === 'present' ? 'absent' : 'present' } : s
    ));
  };

  const submitAttendance = async () => {
    if (!selectedModule) return;
    setSaving(true);
    
    try {
      const res = await fetch('/api/teacher/attendance/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          classCode: selectedModule.classCode, 
          subjectCode: selectedModule.code || selectedModule.title, // Sécurité si code est manquant
          roll: students 
        })
      });
      
      if (res.ok) {
        alert("🎉 Registre d'appel enregistré avec succès !");
      } else {
        const errorData = await res.json();
        alert(`Erreur : ${errorData.error}`);
      }
    } catch (err) {
      alert("Erreur réseau lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingModules) {
    return (
      <div className="flex h-screen items-center justify-center font-bold text-slate-400 gap-2">
        <RefreshCw className="animate-spin" /> Chargement de vos classes...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher-dashboard" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">Faire l'appel</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Registre de présence journalier</p>
          </div>
        </div>

        <button 
          onClick={submitAttendance}
          disabled={saving || students.length === 0 || !selectedModule}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-100 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"
        >
          {saving ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18} />} 
          Enregistrer la fiche
        </button>
      </div>

      {/* Selecteur de classe DYNAMIQUE */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <BookOpen className="text-indigo-600 shrink-0" size={22}/>
          
          {modules.length === 0 ? (
            <p className="font-black text-red-500">Vous n'avez aucun module actif.</p>
          ) : (
            <select 
              value={selectedModule?._id || ''} 
              onChange={(e) => {
                const mod = modules.find(m => m._id === e.target.value);
                if (mod) setSelectedModule(mod);
              }}
              className="bg-transparent font-black text-slate-800 border-b-2 border-slate-100 focus:border-indigo-600 outline-none pb-1 text-base w-full md:w-64 cursor-pointer"
            >
              {modules.map((mod) => (
                <option key={mod._id} value={mod._id}>
                  {mod.classCode} - {mod.title}
                </option>
              ))}
            </select>
          )}
        </div>
        
        {/* Affichage du cours en cours de pointage */}
        {selectedModule && (
          <p className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
            Cours : {selectedModule.title}
          </p>
        )}
      </div>

      {/* Table des étudiants */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {loadingStudents ? (
          <div className="p-12 text-center font-bold text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="animate-spin"/> Extraction de la liste d'élèves...
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {students.map((student) => (
              <div key={student.id} className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50/50 transition-colors gap-4">
                <div>
                  <p className="font-black text-slate-800 text-base">{student.name}</p>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">Matricule: {student.matricule}</p>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => toggleStatus(student.id, 'absent')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all ${student.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-slate-50 text-slate-400'}`}
                  >
                    <UserCheck size={16} /> Présent
                  </button>
                  <button 
                    onClick={() => toggleStatus(student.id, 'present')}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs transition-all ${student.status === 'absent' ? 'bg-red-100 text-red-700 shadow-sm' : 'bg-slate-50 text-slate-400'}`}
                  >
                    <UserX size={16} /> Absent
                  </button>
                </div>
              </div>
            ))}
            {students.length === 0 && !loadingStudents && modules.length > 0 && (
              <p className="p-8 text-center text-slate-400 font-bold">Aucun élève actif trouvé dans la classe {selectedModule?.classCode}.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}