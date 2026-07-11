'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Upload, 
  FileText, 
  FolderOpen, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Inbox,
  Calendar,
  ExternalLink
} from 'lucide-react';

// Interfaces pour le typage strict côté Frontend
interface Resource {
  title: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Module {
  _id: string;
  code: string;
  title: string;
  classCode: string;
  colorAccent: string;
  level: number;
  resources: Resource[];
  class?: { _id: string; name: string };
  subject?: { _id: string; name: string };
}

interface DBOption {
  _id: string;
  name: string;
}

// Interface robuste gérant le format brut ou peuplé (.populate) de MongoDB
interface StudentSubmission {
  _id: string;
  studentName?: string;
  studentEmail?: string;
  student?: {
    _id: string;
    name: string;
    email: string;
  };
  fileUrl: string;
  submittedAt?: string;
  createdAt?: string;
}

export default function TeacherModulesPage() {
  // Liste des données principales
  const [modules, setModules] = useState<Module[]>([]);
  const [classes, setClasses] = useState<DBOption[]>([]);
  const [subjects, setSubjects] = useState<DBOption[]>([]);

  // Nouveaux états pour la gestion des devoirs reçus par module
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // États des Loaders
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingModuleId, setUploadingModuleId] = useState<string | null>(null);

  // États des Modals/Formulaires
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedColor, setSelectedColor] = useState('blue');

  // Système de Notifications contextuel
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Charger les données à l'initialisation
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [resModules, resClasses, resSubjects] = await Promise.all([
          fetch('/api/teacher/modules'),
          fetch('/api/admin/classes'),   
          fetch('/api/admin/subjects')   
        ]);

        if (resModules.ok) setModules(await resModules.json());
        if (resClasses.ok) setClasses(await resClasses.json());
        if (resSubjects.ok) setSubjects(await resSubjects.json());

      } catch (err) {
        showNotification('error', 'Impossible de charger les données serveur.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Déclencheur de notification automatique
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Action : Récupérer et ouvrir les devoirs soumis pour un module précis
  const handleOpenSubmissionsModal = async (mod: Module) => {
    setSelectedModule(mod);
    setIsSubmissionsModalOpen(true);
    setLoadingSubmissions(true);
    setSubmissions([]);

    try {
      // Appel à ton API de soumission filtrée par l'ID du module sélectionné
      const res = await fetch(`/api/teacher/submissions?moduleId=${mod._id}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      } else {
        showNotification('error', 'Échec de la récupération des devoirs.');
      }
    } catch (err) {
      showNotification('error', 'Erreur lors de la connexion au serveur.');
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Action : Activer/Créer une nouvelle matière pour une classe
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedSubject) {
      showNotification('error', 'Veuillez sélectionner une classe et une matière.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/teacher/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass,
          subjectId: selectedSubject,
          colorAccent: selectedColor
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Erreur lors de la création');
      }

      setModules((prev) => [data, ...prev]);
      showNotification('success', 'Matière activée avec succès pour cette classe !');
      setIsModalOpen(false);
      setSelectedClass('');
      setSelectedSubject('');
    } catch (err: any) {
      showNotification('error', err.message || 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  };

  // Action : Upload d'un document dans un module spécifique
  const handleFileUpload = async (moduleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileToUpload = files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('moduleId', moduleId);

    try {
      setUploadingModuleId(moduleId);
      const res = await fetch('/api/teacher/modules/upload', {
        method: 'POST',
        body: formData 
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur pendant le transfert");
      }

      setModules((prev) =>
        prev.map((mod) =>
          mod._id === moduleId
            ? { ...mod, resources: [...(mod.resources || []), data.resource] }
            : mod
        )
      );
      showNotification('success', `Fichier "${fileToUpload.name}" partagé avec succès !`);
    } catch (err: any) {
      showNotification('error', err.message || "Échec du téléversement.");
    } finally {
      setUploadingModuleId(null);
    }
  };

  // Palette d'accents de couleur pour les cartes du dashboard
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500 bg-blue-50 text-blue-700',
    green: 'border-green-500 bg-green-50 text-green-700',
    purple: 'border-purple-500 bg-purple-50 text-purple-700',
    orange: 'border-orange-500 bg-orange-50 text-orange-700',
    red: 'border-red-500 bg-red-50 text-red-700'
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-sm font-medium text-gray-500">Synchronisation de vos modules d'enseignement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      
      {/* Toast Notification Système */}
      {notification && (
        <div className={`fixed right-6 top-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg border text-sm font-medium transition-all duration-300 ${
          notification.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-600" />}
          {notification.message}
        </div>
      )}

      {/* En-tête principal */}
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Espace Cours & Matières</h1>
          <p className="mt-1 text-sm text-gray-500">Activez des matières pour vos classes et transmettez vos fichiers de cours instantanément.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter une matière à une classe
        </button>
      </div>

      {/* Liste des Modules Actifs */}
      {modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-sm font-semibold text-gray-900">Aucun module actif</h3>
          <p className="mt-1 text-sm text-gray-500">Vous n'avez pas encore activé de matière ou de classe pour ce semestre.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <div key={mod._id} className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              
              {/* Top Card - Infos Modules */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-2">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider border ${colorMap[mod.colorAccent] || colorMap.blue}`}>
                    {mod.classCode}
                  </span>
                  <span className="text-xs font-medium text-gray-400">Code: {mod.code}</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 line-clamp-1">{mod.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">Niveau Académique : {mod.level}</p>

                {/* Section Fichiers Liés au Module */}
                <div className="mt-6 border-t border-gray-100 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mb-2">
                    <FolderOpen className="h-3.5 w-3.5" />
                    Documents partagés ({(mod.resources || []).length})
                  </span>
                  
                  {(!mod.resources || mod.resources.length === 0) ? (
                    <p className="text-xs italic text-gray-400">Aucun fichier déposé pour le moment.</p>
                  ) : (
                    <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {mod.resources.map((res, idx) => {
                        if (!res) return null; // Sécurité anti-crash si l'objet est nul
                        return (
                          <li key={idx} className="flex items-center justify-between rounded bg-gray-50 px-2 py-1.5 border border-gray-100">
                            <a 
                              href={res.fileUrl || "#"} 
                              target={res.fileUrl ? "_blank" : "_self"} 
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                if (!res.fileUrl) {
                                  e.preventDefault();
                                  alert("Fichier introuvable ou corrompu.");
                                }
                              }}
                              className="flex items-center gap-2 text-xs font-medium text-indigo-600 hover:underline truncate max-w-[80%]"
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                              <span className="truncate">{res.title || "Document sans titre"}</span>
                            </a>
                            <span className="text-[10px] text-gray-400">
                              {res.uploadedAt ? new Date(res.uploadedAt).toLocaleDateString() : ""}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>

              {/* Action Bar Card Double Section - Upload ET Consultation des devoirs */}
              <div className="border-t border-gray-100 bg-gray-50/50 rounded-b-xl grid grid-cols-2 divide-x divide-gray-200">
                
                {/* Bouton Dépôt Document */}
                <label className={`flex items-center justify-center gap-2 text-xs font-semibold text-gray-600 hover:text-indigo-600 cursor-pointer py-3.5 transition-colors ${
                  uploadingModuleId === mod._id ? 'pointer-events-none opacity-50' : ''
                }`}>
                  {uploadingModuleId === mod._id ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                      En cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Déposer un cours
                    </>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileUpload(mod._id, e)}
                    disabled={uploadingModuleId !== null}
                  />
                </label>

                {/* Nouveau Bouton : Ouvrir l'espace Devoirs Reçus */}
                <button
                  type="button"
                  onClick={() => handleOpenSubmissionsModal(mod)}
                  className="flex items-center justify-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/40 py-3.5 rounded-br-xl transition-all"
                >
                  <Inbox className="h-3.5 w-3.5" />
                  Devoirs reçus
                </button>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* NOUVEAU MODAL : Affichage des copies d'étudiants reçues */}
      {isSubmissionsModalOpen && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 flex flex-col max-h-[85vh]">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-indigo-600 uppercase">Boite de réception</span>
                <h2 className="text-xl font-bold text-gray-900 line-clamp-1">{selectedModule.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Étudiants inscrits en {selectedModule.classCode}</p>
              </div>
              <button 
                onClick={() => setIsSubmissionsModalOpen(false)} 
                className="rounded-xl p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Corps du Modal avec gestion des différents états */}
            <div className="mt-4 flex-1 overflow-y-auto pr-1 py-2">
              {loadingSubmissions ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <p className="mt-3 text-xs font-medium text-gray-400">Récupération des fichiers étudiants...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                  <Inbox className="h-10 w-10 text-gray-300" />
                  <p className="mt-3 text-sm font-semibold text-gray-700">Aucune copie reçue</p>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">Les étudiants de cette classe n'ont pas encore téléversé de devoir pour ce module.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub) => {
                    // Extraction sécurisée du nom de l'étudiant selon le format renvoyé par Mongoose
                    const studentName = sub.student?.name || sub.studentName || "Étudiant Anonyme";
                    const dateRendu = sub.submittedAt || sub.createdAt || new Date().toISOString();

                    return (
                      <div 
                        key={sub._id} 
                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:border-gray-200 transition-all"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-black text-xs uppercase shrink-0">
                            {studentName.substring(0, 2)}
                          </div>
                          <div className="truncate">
                            <h4 className="text-sm font-bold text-gray-800 truncate">{studentName}</h4>
                            <span className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3" />
                              Rendu le {new Date(dateRendu).toLocaleDateString('fr-FR')} à {new Date(dateRendu).toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                        </div>

                        <a 
                          href={sub.fileUrl || "#"}
                          target={sub.fileUrl ? "_blank" : "_self"}
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!sub.fileUrl) {
                              e.preventDefault();
                              alert("Impossible d'ouvrir ce document, l'URL est introuvable.");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-700 border border-gray-200 px-3 py-2 text-xs font-bold transition-all shrink-0 shadow-sm"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Ouvrir le PDF
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Modal */}
            <div className="mt-4 border-t border-gray-100 pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSubmissionsModalOpen(false)}
                className="rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition-colors"
              >
                Fermer la liste
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal d'affectation : Associer une Matière de la BD à une Classe */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-gray-100">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-lg font-bold text-gray-900">Activer une matière</h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateModule} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Classe ciblée</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
                  required
                >
                  <option value="">Sélectionner une classe (ex: L1-INFO)</option>
                  {classes.map((cls) => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Matière à enseigner</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
                  required
                >
                  <option value="">Sélectionner la matière (depuis la BD)</option>
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Couleur distinctive du module</label>
                <div className="flex gap-3 mt-1.5">
                  {['blue', 'green', 'purple', 'orange', 'red'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`h-6 w-6 rounded-full border-2 capitalize transition-transform ${
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                      } ${selectedColor === color ? 'scale-125 border-gray-900 shadow-sm' : 'border-transparent'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                  Valider l'affectation
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}