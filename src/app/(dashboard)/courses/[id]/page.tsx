"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FileText, Download, CheckCircle, Clock, ArrowLeft, Loader2, UploadCloud } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: string;
  viewed: boolean;
  fileUrl: string; // URL indispensable pour ouvrir le fichier
}

interface Assignment {
  id: string;
  title: string;
  deadline: string;
  hasSubmitted: boolean;
}

interface CourseDetail {
  title: string;
  teacherName: string;
  level: string;
  resources: Resource[];
  assignment: Assignment | null;
}

export default function CourseDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingAssignment, setSubmittingAssignment] = useState(false);

  const fetchCourseData = () => {
    fetch(`/api/student/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.title) setCourse(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (id) fetchCourseData();
  }, [id]);

  const handleResourceClick = async (resourceId: string, viewed: boolean) => {
    if (viewed) return;
    try {
      await fetch('/api/student/courses/toggle-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId: id, resourceId }),
      });
      fetchCourseData();
    } catch (err) {
      console.error("Erreur progression");
    }
  };

  const handleAssignmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileToSubmit = files[0];
    const formData = new FormData();
    formData.append('file', fileToSubmit);
    formData.append('moduleId', id);
    
    formData.append('assignmentId', course?.assignment?.id || "general");

    try {
      setSubmittingAssignment(true);
      const res = await fetch('/api/student/assignments/submit', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert("Document envoyé avec succès !");
        fetchCourseData();
      } else {
        alert("Échec de l'envoi du document.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingAssignment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!course) {
    return <p className="text-center font-bold text-red-500">Aucun cours trouvé.</p>;
  }

  const viewedCount = (course.resources || []).filter(r => r && r.viewed).length;
  const progress = (course.resources && course.resources.length > 0) ? (viewedCount / course.resources.length) * 100 : 0;

  return (
    <div className="space-y-6 px-2 sm:px-0 pb-10">
      <Link href="/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-colors group">
        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-blue-200">
          <ArrowLeft size={20} />
        </div>
        Retour aux cours
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-xl sm:text-3xl font-black text-gray-900 leading-tight">{course.title}</h1>
        <p className="text-gray-500 mt-2 font-semibold text-xs sm:text-sm">{course.teacherName} • {course.level}</p>
        
        <div className="mt-6">
          <div className="flex justify-between text-xs sm:text-sm mb-2 font-bold">
            <span className="text-gray-400 uppercase tracking-wider">Progression</span>
            <span className="text-blue-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION SUPPORTS DE COURS */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-gray-100 order-2 lg:order-1">
          <h3 className="text-base sm:text-lg font-black mb-6 text-gray-800">Supports de cours</h3>
          <div className="space-y-4">
            {(!course.resources || course.resources.length === 0) ? (
              <p className="text-sm text-gray-400 italic">Aucun support disponible pour l'instant.</p>
            ) : (
              course.resources.map((res) => {
                if (!res) return null;
                const resourceId = res.id || (res as any)._id;

                return (
                  <a 
                    key={resourceId} 
                    href={res.fileUrl || "#"} 
                    target={res.fileUrl ? "_blank" : "_self"} 
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!res.fileUrl) {
                        e.preventDefault();
                        alert("Ce document est corrompu ou indisponible.");
                        return;
                      }
                      handleResourceClick(resourceId, res.viewed);
                    }} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      res.viewed ? "bg-green-50 border-green-100 shadow-sm" : "bg-gray-50 border-gray-100 hover:border-blue-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`p-2.5 rounded-xl ${res.viewed ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                        <FileText size={20} />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-bold text-gray-800 truncate">{res.title || "Support de cours"}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{res.type || "Document"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {res.viewed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100/50 px-2.5 py-1 rounded-full">
                          <CheckCircle size={14} /> Lu
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100/50 px-2.5 py-1 rounded-full">
                          Ouvrir <Download size={14} />
                        </span>
                      )}
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>

        {/* SECTION ESPACE DEVOIRS */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-gray-100 order-1 lg:order-2">
          <h3 className="text-base sm:text-lg font-black mb-6 text-red-600">Espace Devoirs</h3>
          
          <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${course.assignment?.hasSubmitted ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Clock className={course.assignment?.hasSubmitted ? "text-green-600" : "text-red-600"} />
              <p className="font-black italic text-sm sm:text-base">
                {course.assignment?.hasSubmitted 
                  ? "Travail transmis ✔" 
                  : course.assignment?.deadline 
                    ? `Deadline : ${new Date(course.assignment.deadline).toLocaleDateString('fr-FR')}` 
                    : "Dépôt libre ouvert"}
              </p>
            </div>
            
            <p className="text-xs sm:text-sm font-medium mb-6">
              {course.assignment?.hasSubmitted 
                ? "Ton travail a bien été reçu. Tu peux renvoyer un PDF pour remplacer l'ancien." 
                : "Seul le format PDF est accepté pour l'envoi."}
            </p>
            
            {/* BOUTON D'UPLOAD */}
            <label className={`w-full flex items-center justify-center gap-2 font-black py-4 rounded-xl transition-all cursor-pointer text-center text-sm shadow-md ${course.assignment?.hasSubmitted ? "bg-white border-2 border-green-200 text-green-700 hover:bg-green-100" : "bg-red-600 text-white hover:bg-red-700"}`}>
              {submittingAssignment ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
              
              {submittingAssignment 
                ? "Dépôt en cours..." 
                : course.assignment?.hasSubmitted 
                  ? "Remplacer mon devoir (PDF)" 
                  : "Sélectionner et déposer mon PDF"}
                  
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handleAssignmentUpload} 
                disabled={submittingAssignment} 
              />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}