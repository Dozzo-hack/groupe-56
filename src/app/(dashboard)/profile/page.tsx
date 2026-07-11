"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, X, GraduationCap, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [user, setUser] = useState({
    name: "",
    matricule: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    birthDate: "",
    department: "",
    level: "",
    avatar: null as string | null
  });

  // 🔄 Charger le profil de l'étudiant connecté
  useEffect(() => {
    fetch('/api/auth/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser({
            name: data.user.name || "Étudiant",
            matricule: data.user.matricule || "Non assigné",
            email: data.user.email || "",
            phone: data.user.phone || "",
            address: data.user.address || data.user.residence || "",
            city: data.user.city || "Douala",
            birthDate: data.user.birthDate ? new Date(data.user.birthDate).toLocaleDateString('fr-FR') : "Non renseignée",
            department: data.user.department || "Génie Logiciel",
            level: data.user.level || data.user.classCode || "Niveau 1",
            avatar: data.user.avatar || null
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur profile étudiant:", err);
        setLoading(false);
      });
  }, []);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUser({ ...user, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  // 💾 Enregistrer les données modifiées de l'étudiant
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: user.phone,
          address: user.address,
          city: user.city,
          avatar: user.avatar
        })
      });

      if (res.ok) {
        setIsEditing(false);
      } else {
        alert("Erreur lors de l'enregistrement.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const InfoField = ({ icon: Icon, label, value, field, color = "blue", editable = true }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={22} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        {isEditing && editable ? (
          <input 
            type="text" 
            value={value} 
            onChange={(e) => setUser({...user, [field]: e.target.value})}
            className="w-full font-bold text-blue-600 border-b-2 border-blue-200 outline-none bg-transparent py-1"
          />
        ) : (
          <p className="font-bold text-slate-700">{value || "Non complété"}</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        
        {/* Banner */}
        <div className="h-48 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-700" />
        
        <div className="px-12 pb-12">
          <div className="relative -mt-24 mb-10 flex items-end gap-10">
            <div className="relative group">
              <div className="w-48 h-48 bg-white rounded-[2.5rem] p-2 shadow-2xl">
                <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <User size={100} className="text-slate-300" />
                  )}
                </div>
              </div>
              <button onClick={handlePhotoClick} className="absolute bottom-3 right-3 bg-blue-600 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera size={24} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
            </div>

            <div className="pb-6 space-y-2">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter">{user.name}</h1>
              <div className="flex gap-3">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">{user.department}</span>
                <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-sm font-bold">{user.level}</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Cursus Académique */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <GraduationCap size={16}/> Parcours Académique
              </h3>
              <InfoField icon={User} label="Numéro Matricule" value={user.matricule} field="matricule" color="slate" editable={false} />
              <InfoField icon={Calendar} label="Date de naissance" value={user.birthDate} field="birthDate" editable={false} />
              <InfoField icon={GraduationCap} label="Filière / Département" value={user.department} field="department" editable={false} />
            </div>

            {/* Coordonnées Modifiables */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-green-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <MapPin size={16}/> Coordonnées & Résidence
              </h3>
              <InfoField icon={Mail} label="Email Académique" value={user.email} field="email" color="green" editable={false} />
              <InfoField icon={Phone} label="Téléphone" value={user.phone} field="phone" color="green" />
              <InfoField icon={MapPin} label="Quartier de résidence" value={user.address} field="address" color="green" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {isEditing ? (
          <>
            <button onClick={() => setIsEditing(false)} className="px-10 py-4 bg-white text-slate-500 rounded-2xl font-black border-2 border-slate-100 hover:bg-slate-50 transition-all">
              Annuler
            </button>
            <button onClick={handleSave} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
              {saving ? "Sauvegarde..." : <><Save size={20}/> Sauvegarder</>}
            </button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-300 hover:bg-black transition-all">
            Modifier le profil
          </button>
        )}
      </div>
    </div>
  );
}