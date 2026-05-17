"use client";

import React, { useState, useRef } from 'react';
import { 
  User, Mail, Shield, MapPin, ArrowLeft, 
  Camera, Check, Lock, Phone, Calendar, 
  Hash, Briefcase, Globe 
} from 'lucide-react';
import Link from 'next/link';

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // Référence pour l'input de fichier
  const fileInputRef = useRef<HTMLInputElement>(null);

  // État des données (Simulé)
  const [profile, setProfile] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    matricule: "TP-2026-0045",
    birthDate: "12/05/1985",
    email: "j.dupont@uniportal.edu",
    phone: "+237 670 00 00 00",
    residence: "Bastos, Yaoundé",
    department: "Génie Informatique",
    specialization: "Intelligence Artificielle & Big Data"
  });

  // Gestion de l'import de photo
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setIsEditing(false);
      // Logique de sauvegarde API ici
    }, 1200);
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen space-y-8 animate-in fade-in duration-500">
      
      {/* Header avec Actions */}
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-5">
          <Link href="/teacher-dashboard" className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Paramètres du Compte</h1>
            <p className="text-sm text-slate-500 font-medium">Gérez vos informations personnelles et professionnelles</p>
          </div>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-sm hover:shadow-lg hover:shadow-indigo-100 transition-all"
          >
            Modifier le profil
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)} 
              className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-black text-sm hover:bg-slate-200"
            >
              Annuler
            </button>
            <button 
              onClick={handleUpdate} 
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-sm flex items-center gap-2 hover:bg-black transition-all"
            >
              {saving ? "Enregistrement..." : <><Check size={18}/> Enregistrer les modifications</>}
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* SECTION 1 : Identité Fixe (Lecture Seule) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10 text-center">
              
              {/* Zone Photo Interactive */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden" 
                />
                <div className="w-full h-full bg-slate-100 rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                   {profileImage ? (
                     <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
                   ) : (
                     <User size={64} className="text-slate-300" />
                   )}
                </div>
                {/* Le bouton déclenche l'input caché */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-lg text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  <Camera size={16} />
                </button>
              </div>
              
              <h2 className="text-2xl font-black text-slate-900">{profile.firstName} {profile.lastName}</h2>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-tighter mb-6">{profile.department}</p>
              
              <div className="space-y-3 pt-6 border-t border-slate-50 text-left">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold flex items-center gap-2"><Hash size={14}/> Matricule</span>
                  <span className="text-slate-900 font-black tracking-tight">{profile.matricule}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 font-bold flex items-center gap-2"><Calendar size={14}/> Né le</span>
                  <span className="text-slate-900 font-black">{profile.birthDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 flex gap-4">
            <Lock className="text-amber-600 shrink-0" size={20} />
            <p className="text-[11px] leading-relaxed text-amber-800 font-bold">
              Les données d'identité civile sont verrouillées par l'administration pour garantir l'intégrité du système scolaire.
            </p>
          </div>
        </div>

        {/* SECTION 2 : Informations Modifiables */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Contact & Localisation */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3 italic">
              <Globe className="text-indigo-600" size={22} /> Informations de Contact
            </h3>
            
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 italic ml-2">
                  <Mail size={12}/> Email Professionnel
                </label>
                <input 
                  type="email" 
                  defaultValue={profile.email}
                  disabled={!isEditing}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 italic ml-2">
                  <Phone size={12}/> Téléphone
                </label>
                <input 
                  type="text" 
                  defaultValue={profile.phone}
                  disabled={!isEditing}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed" 
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2 italic ml-2">
                  <MapPin size={12}/> Lieu de résidence
                </label>
                <input 
                  type="text" 
                  defaultValue={profile.residence}
                  disabled={!isEditing}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          {/* Expertise & Sécurité */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3 italic">
              <Briefcase className="text-indigo-600" size={22} /> Expertise & Sécurité
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase italic ml-2">Spécialisation</label>
                <input 
                  type="text" 
                  defaultValue={profile.specialization}
                  disabled={!isEditing}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-indigo-500 disabled:opacity-60" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase italic ml-2 flex items-center gap-1">
                   <Shield size={12}/> Nouveau mot de passe
                </label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  disabled={!isEditing}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all font-bold text-slate-700 focus:bg-white focus:border-indigo-500 disabled:opacity-60" 
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}