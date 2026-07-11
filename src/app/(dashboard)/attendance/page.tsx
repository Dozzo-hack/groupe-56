"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Calendar, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function StudentAttendancePage() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [stats, setStats] = useState({ globalRate: "0%", absences: 0, lates: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentAttendance = async () => {
    try {
      // 🎯 CORRECTION : Sécurisation de la requête avec l'en-tête approprié
      const res = await fetch('/api/student/attendance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setAttendanceData(data.modules || []);
        setStats({
          globalRate: data.globalRate || "0%",
          absences: data.totalAbsences || 0,
          lates: data.totalLates || 0
        });
      } else {
        // Gère les erreurs 401 (Token expiré) ou 404 (Étudiant introuvable)
        const errData = await res.json();
        setError(errData.error || "Erreur lors du chargement des présences.");
      }
    } catch (err) {
      console.error("Impossible de charger le relevé d'assiduité", err);
      setError("Erreur réseau. Veuillez vérifier votre connexion.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentAttendance();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center font-bold text-slate-400 gap-2">
        <RefreshCw className="animate-spin" /> Analyse de votre dossier d'assiduité...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center font-bold text-red-500 gap-4">
        <div className="flex items-center gap-2">
          <AlertCircle /> {error}
        </div>
        <Link href="/login" className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition">
          Se reconnecter
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">Mes Présences</h1>
        </div>
        <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] ml-11">Suivi d'assiduité individuel</p>
      </div>

      {/* Cartes de Stats Flash */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center"><CheckCircle2 size={28} /></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taux Global</p>
            <p className="text-3xl font-black text-slate-900">{stats.globalRate}</p>
          </div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center"><XCircle size={28} /></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absences</p>
            <p className="text-3xl font-black text-slate-900">{stats.absences < 10 ? `0${stats.absences}` : stats.absences}</p>
          </div>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-50 shadow-sm flex items-center justify-between">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center"><AlertCircle size={28} /></div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retards</p>
            <p className="text-3xl font-black text-slate-900">{stats.lates < 10 ? `0${stats.lates}` : stats.lates}</p>
          </div>
        </div>
      </div>

      {/* Tableau détaillé */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <Calendar size={20} className="text-indigo-600" />
          <h2 className="font-black text-slate-800 text-lg">Détail par module d'enseignement</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
              <tr>
                <th className="p-6">Matière</th>
                <th className="p-6 text-center">Cours dispensés</th>
                <th className="p-6 text-center text-green-600">Présences</th>
                <th className="p-6 text-center text-red-600">Absences</th>
                <th className="p-6">État réglementaire</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {attendanceData.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-black text-slate-800">{item.subject}</td>
                  <td className="p-6 text-center font-bold text-slate-400">{item.totalClasses}</td>
                  <td className="p-6 text-center"><span className="bg-green-50 text-green-700 font-black px-3 py-1 rounded-lg text-xs">{item.present}</span></td>
                  <td className="p-6 text-center"><span className={`font-black px-3 py-1 rounded-lg text-xs ${item.absent > 2 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-400'}`}>{item.absent}</span></td>
                  <td className="p-6">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${item.status === 'Parfait' ? 'text-green-500' : item.status === 'Attention' ? 'text-red-500' : 'text-slate-500'}`}>
                      ● {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note d'information */}
      <div className="p-6 bg-indigo-50/70 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
        <AlertCircle className="text-indigo-600 shrink-0 mt-0.5" size={20} />
        <p className="text-xs md:text-sm font-bold text-indigo-900 leading-relaxed italic">
          Au-delà de 3 absences non justifiées dans un même module, vous risquez une invalidation de l'UE. 
          En cas d'erreur de pointage, veuillez soumettre immédiatement une <Link href="/dashboard/tickets" className="underline font-black hover:text-indigo-700 transition-colors">requête administrative</Link>.
        </p>
      </div>
    </div>
  );
}