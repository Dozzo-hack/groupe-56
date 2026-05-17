"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, UserCheck, UserX, Search } from 'lucide-react';
import Link from 'next/link';

export default function TeacherAttendance() {
  const [students, setStudents] = useState([
    { id: 1, name: "Duhamel", status: 'present' },
    { id: 2, name: "Alice Wong", status: 'present' },
    { id: 3, name: "Jean-Luc Picard", status: 'absent' },
    { id: 4, name: "Sarah Connor", status: 'present' },
  ]);

  const toggleStatus = (id: number) => {
    setStudents(students.map(s => 
      s.id === id ? { ...s, status: s.status === 'present' ? 'absent' : 'present' } : s
    ));
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teacher-dashboard" className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Faire l'appel</h1>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
          <Save size={20} /> Enregistrer
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p className="font-bold text-slate-500">Cours : <span className="text-slate-900">Algorithmique Avancée</span></p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Chercher un étudiant..." className="pl-12 pr-6 py-3 bg-slate-50 rounded-xl text-sm outline-none w-full md:w-64" />
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {students.map((student) => (
            <div key={student.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400">
                  {student.name[0]}
                </div>
                <span className="font-bold text-slate-700">{student.name}</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => toggleStatus(student.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${student.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}
                >
                  <UserCheck size={16} /> Présent
                </button>
                <button 
                  onClick={() => toggleStatus(student.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs transition-all ${student.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-400'}`}
                >
                  <UserX size={16} /> Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}