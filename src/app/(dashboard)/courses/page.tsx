"use client";

import React from 'react';
// Vérifie bien que cette ligne est exactement comme ça :
import Link from 'next/link'; 
import { BookOpen, PlayCircle } from 'lucide-react';

export default function CoursesPage() {
  const courses = [
    { id: "algo-1", title: "Algorithmique & Programmation 1", prof: "Dr. Diallo", progress: 75, color: "bg-blue-500" },
    { id: "systeme-1", title: "Introduction aux Systèmes", prof: "M. Kamga", progress: 40, color: "bg-purple-500" },
    { id: "maths-1", title: "Mathématiques Discrètes", prof: "Mme. Tekam", progress: 90, color: "bg-green-500" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Mes Cours</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className={`h-2 ${course.color}`} />
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <BookOpen className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{course.prof}</span>
              </div>
              <h3 className="font-bold text-gray-800 h-12 mb-4">{course.title}</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Progression</span>
                  <span className="font-bold text-blue-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${course.color}`} style={{ width: `${course.progress}%` }} />
                </div>
              </div>

              {/* Utilisation du composant Link importé plus haut */}
              <Link 
                href={`/courses/${course.id}`} 
                className="w-full mt-6 flex items-center justify-center gap-2 py-2 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition"
              >
                <PlayCircle size={18} /> Continuer le cours
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}