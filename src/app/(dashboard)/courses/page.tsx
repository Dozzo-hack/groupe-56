"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; 
import { BookOpen, PlayCircle, Loader2, Inbox } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  title: string;
  teacherName: string;
  progression: number;
  colorAccent: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/courses')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const getColorStyle = (color: string) => {
    switch(color) {
      case 'purple': return 'bg-purple-500';
      case 'green': return 'bg-emerald-500';
      case 'orange': return 'bg-orange-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-0">
      <h1 className="text-2xl font-black text-gray-800">Mes Cours</h1>
      
      {courses.length === 0 ? (
        /* État vide si l'API renvoie un tableau vide [] */
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center shadow-sm">
          <Inbox className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900">Aucun cours disponible</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-sm">
            Votre classe n'est actuellement liée à aucun module actif. Contactez votre administration ou vos enseignants si nécessaire.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className={`h-2 ${getColorStyle(course.colorAccent)}`} />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <BookOpen className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{course.teacherName}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 min-h-[3rem] mb-4 text-base sm:text-lg leading-snug">{course.title}</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progression</span>
                      <span className="font-bold text-blue-600">{course.progression}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${getColorStyle(course.colorAccent)} transition-all duration-500`} style={{ width: `${course.progression}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link 
                  href={`/courses/${course.id}`} 
                  className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-sm"
                >
                  <PlayCircle size={18} /> Continuer le cours
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}