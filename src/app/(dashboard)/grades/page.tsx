"use client";

import React, { useState, useEffect } from 'react';
import { Award, Book, GraduationCap, ChevronRight, Loader2 } from 'lucide-react';

interface Module {
  name: string;
  grade: number;
  coeff: number;
}

interface UE {
  name: string;
  credits: number;
  modules: Module[];
}

interface Semester {
  id: string;
  label: string;
  totalCredits: number;
  average: number;
  ues: UE[];
}

export default function GradesPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [globalAverage, setGlobalAverage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await fetch('/api/grades/student');
        const data = await response.json();
        if (data.semesters) {
          setSemesters(data.semesters);
          setGlobalAverage(data.globalAverage);
        }
      } catch (error) {
        console.error("Erreur de chargement des notes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGrades();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Relevé de Notes</h1>
          <p className="text-gray-500 font-medium italic">Année Universitaire en cours</p>
        </div>
        
        {globalAverage !== null && (
          <div className="w-full md:w-auto bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Moyenne Générale</p>
              <p className="text-xl font-black text-blue-600">{globalAverage.toFixed(2)} / 20</p>
            </div>
          </div>
        )}
      </div>

      {semesters.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-bold">Aucune note disponible pour le moment.</p>
        </div>
      ) : (
        semesters.map((semester) => (
          <div key={semester.id} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
              <ChevronRight className="text-blue-600" /> {semester.label}
            </h2>

            {semester.ues.map((ue, ueIndex) => (
              <div key={ueIndex} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-50/80 px-6 md:px-8 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-black text-gray-800 uppercase text-xs md:text-sm tracking-widest">{ue.name}</h3>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] md:text-xs font-black shrink-0">
                    {ue.credits} ECTS
                  </span>
                </div>

                <div className="divide-y divide-gray-50">
                  {ue.modules.map((module, modIndex) => (
                    <div key={modIndex} className="px-6 md:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex shrink-0 items-center justify-center text-gray-400">
                          <Book size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm md:text-base">{module.name}</p>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter">Coefficient : {module.coeff}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 self-end sm:self-auto">
                        <div className="text-right">
                          <span className={`text-lg font-black ${module.grade >= 10 ? 'text-gray-900' : 'text-red-500'}`}>
                            {module.grade ? module.grade.toFixed(2) : '--'}
                          </span>
                          <span className="text-gray-300 text-xs ml-1">/ 20</span>
                        </div>
                        <div className={`h-2 w-2 rounded-full shrink-0 ${module.grade && module.grade >= 10 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}