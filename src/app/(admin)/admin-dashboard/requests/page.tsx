"use client";

import React, { useState } from 'react';
import { 
  MessageSquare, Clock, CheckCircle, AlertCircle, 
  Send, User, Calendar, Paperclip, 
  ArrowLeft, X, Check, Bell, Archive,ChevronRight, Share2, FileText, Image as ImageIcon
} from 'lucide-react';

export default function AdminRequestsPro() {
  const [view, setView] = useState<'active' | 'history'>('active');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  // Simulation des données avec historique
  const [requests, setRequests] = useState([
    { 
      id: "REQ-001", 
      student: "Paul Biya", 
      type: "Correction de Note", 
      subject: "Erreur sur la note de React JS", 
      description: "Erreur de saisie constatée sur mon relevé.",
      attachment: "preuve.jpg",
      date: "30 Avril 2026", 
      status: "pending", 
      priority: "high",
      internalNotes: "Vu avec le prof, il confirme l'erreur.",
      messages: [
        { sender: "student", text: "J'ai joint mon brouillon.", time: "10:30", type: "text" }
      ]
    },
    { 
      id: "REQ-999", 
      student: "Cédric Doumbé", 
      type: "Administratif", 
      subject: "Demande de diplôme 2025", 
      description: "Besoin d'une copie certifiée.",
      attachment: null,
      date: "15 Mars 2026", 
      status: "resolved", 
      priority: "medium",
      internalNotes: "Document envoyé le 16/03",
      messages: [
        { sender: "admin", text: "Voici votre document scanné.", time: "14:20", type: "file", fileName: "Diplome_Doumbe.pdf" }
      ]
    }
  ]);

  const activeRequests = requests.filter(r => r.status === 'pending');
  const historyRequests = requests.filter(r => r.status === 'resolved');

  return (
    <div className="p-8 space-y-8">
      {/* Header avec Switch Actif/Historique */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">Support</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Gestion des flux et archives</p>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm">
                <button 
                  onClick={() => setView('active')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all ${view === 'active' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Clock size={16} /> En cours ({activeRequests.length})
                </button>
                <button 
                  onClick={() => setView('history')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all ${view === 'history' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Archive size={16} /> Historique ({historyRequests.length})
                </button>
            </div>
        </div>
      </div>

      {/* Liste des cartes filtrées */}
      <div className="grid gap-4">
        {(view === 'active' ? activeRequests : historyRequests).map((req) => (
          <div 
            key={req.id} 
            onClick={() => setSelectedRequest(req)}
            className="group bg-white p-8 rounded-[3rem] border border-slate-50 hover:border-indigo-500 transition-all shadow-sm hover:shadow-2xl flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-8">
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all ${req.status === 'pending' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                {req.status === 'pending' ? <MessageSquare size={32} /> : <CheckCircle size={32} />}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-2 inline-block italic">Support {req.type}</span>
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">{req.subject}</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Étudiant : <span className="text-slate-900">{req.student}</span> • {req.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- PANEL DE GESTION (MODAL) --- */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex justify-end">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            
            {/* Header du Panel */}
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-5">
                <button onClick={() => setSelectedRequest(null)} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-100 transition-all text-slate-500"><ArrowLeft size={20} /></button>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedRequest.student}</h2>
                  <p className="text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase">{selectedRequest.id}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 transition-all" title="Transférer à un service"><Share2 size={20} /></button>
                <button className="flex items-center gap-2 px-6 py-4 bg-green-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-green-100">
                  <Check size={20} /> Résoudre le cas
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10">
              {/* Détails de la requête */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] px-2">Objet du dossier</h4>
                <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <p className="text-lg font-bold text-slate-700 leading-relaxed italic">"{selectedRequest.description}"</p>
                  {selectedRequest.attachment && (
                    <div className="mt-6 flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={20}/></div>
                      <span className="flex-1 text-sm font-black text-slate-600">{selectedRequest.attachment}</span>
                      <button className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">VOIR</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Zone de Chat avec Transfert de Fichiers */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] px-2 text-center">Échanges sécurisés</h4>
                
                {/* Message Admin avec Fichier */}
                <div className="flex flex-col items-start gap-2">
                   <div className="bg-slate-100 px-6 py-4 rounded-[2rem] rounded-tl-none max-w-[85%]">
                      <p className="text-sm font-bold text-slate-600">Bonjour {selectedRequest.student.split(' ')[0]}, veuillez trouver votre document en pièce jointe ci-dessous.</p>
                      <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                         <div className="p-2 bg-red-50 text-red-500 rounded-lg"><FileText size={16}/></div>
                         <span className="text-[10px] font-black text-slate-500 italic uppercase tracking-tighter">Certificat_Scolarite.pdf</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 mt-3 block uppercase">Secrétariat • 14:10</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Barre d'envoi Admin optimisée */}
            <div className="p-8 bg-white border-t border-slate-100">
              <div className="flex flex-col gap-4">
                 {/* Note interne (Visible uniquement par l'admin) */}
                 <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border border-amber-100">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-black uppercase">Note interne :</span>
                    <input type="text" placeholder="Ajouter une note de suivi..." className="bg-transparent flex-1 text-[10px] font-bold outline-none placeholder:text-amber-300" />
                 </div>

                 <div className="flex gap-4 items-center">
                    <div className="flex-1 flex gap-3 items-center bg-slate-50 p-2 rounded-[2.5rem] border border-slate-100">
                      <label className="p-4 bg-white text-slate-400 rounded-full cursor-pointer hover:text-indigo-600 shadow-sm transition-all">
                        <Paperclip size={20} />
                        <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                      </label>
                      <input 
                        type="text" 
                        placeholder="Votre réponse officielle..." 
                        className="flex-1 bg-transparent px-2 font-bold text-slate-700 outline-none"
                      />
                      <button className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">
                        <Send size={24} />
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}