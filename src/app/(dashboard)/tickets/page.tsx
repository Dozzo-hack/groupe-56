"use client";

import React, { useState } from 'react';
import { 
  PlusCircle, Clock, CheckCircle2, FileText, Send, 
  X, AlertCircle, MessageCircle, Paperclip, Download 
} from 'lucide-react';

export default function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null); // Pour ouvrir le chat
  
  const tickets = [
    { 
      id: "REQ-001", 
      type: "Certificat de scolarité", 
      date: "28/04/2026", 
      status: "Validé",
      adminMessage: "Bonjour, votre certificat est prêt. Vous pouvez le télécharger ci-dessous.",
      adminFile: "Certificat_Scolarite_Paul.pdf" // Fichier envoyé par l'admin
    },
    { 
      id: "REQ-002", 
      type: "Relevé de notes S1", 
      date: "29/04/2026", 
      status: "En attente",
      adminMessage: null,
      adminFile: null
    },
  ];

  const requestTypes = [
    { id: 'reclamation', label: 'Réclamation (Note manquante / Erreur)', docs: 'Copie du bordereau ou preuve de présence' },
    { id: 'certif', label: 'Certificat de scolarité', docs: 'Justificatif de paiement des frais' },
    { id: 'releve', label: 'Relevé de notes officiel', docs: 'Copie de la carte d\'étudiant' },
    { id: 'carte', label: 'Duplicata de carte d\'étudiant', docs: 'Déclaration de perte' },
  ];

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Mes Requêtes</h1>
          <p className="text-slate-500 text-sm font-medium">Suivez l'avancement de vos demandes administratives.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
        >
          <PlusCircle size={20} />
          Nouvelle requête
        </button>
      </div>

      {/* TABLEAU DES TICKETS */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="p-6">ID Requête</th>
              <th className="p-6">Nature de la demande</th>
              <th className="p-6">Date d'émission</th>
              <th className="p-6">État</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="p-6 font-mono text-xs font-bold text-slate-400">{ticket.id}</td>
                <td className="p-6">
                    <p className="font-black text-slate-700">{ticket.type}</p>
                </td>
                <td className="p-6 text-sm font-bold text-slate-500">{ticket.date}</td>
                <td className="p-6">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    ticket.status === "Validé" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {ticket.status === "Validé" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {ticket.status}
                  </span>
                </td>
                <td className="p-6 text-right">
                    <button 
                        onClick={() => setSelectedTicket(ticket)}
                        className="p-3 bg-slate-100 text-slate-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm"
                    >
                        <MessageCircle size={18} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL : CRÉATION DE REQUÊTE (Ton code optimisé) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-8 flex justify-between items-center text-white">
              <div>
                <h2 className="text-2xl font-black tracking-tighter">Soumettre un dossier</h2>
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mt-1">Formulaire officiel</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition"><X size={20}/></button>
            </div>
            
            <form className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nature du problème</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all">
                  <option value="">Sélectionnez un motif...</option>
                  {requestTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description</label>
                <textarea 
                  rows={3}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all resize-none"
                  placeholder="Décrivez votre situation ici..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Pièce justificative</label>
                <div className="relative group">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500 transition-all">
                        <Paperclip size={20} />
                        <span className="text-sm font-black italic">Joindre un document (PDF, JPG)</span>
                    </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3"
              >
                <Send size={20} /> Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL : SUIVI / CHAT (Pour recevoir les fichiers Admin) --- */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                 <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">{selectedTicket.id}</span>
                    <h3 className="text-xl font-black text-slate-800 mt-2">{selectedTicket.type}</h3>
                 </div>
                 <button onClick={() => setSelectedTicket(null)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500 transition-all"><X size={20}/></button>
              </div>

              <div className="p-8 bg-slate-50/50 space-y-6">
                 <div className="flex flex-col items-start gap-2">
                    <div className="bg-white p-6 rounded-[2rem] rounded-tl-none shadow-sm border border-slate-100">
                       <p className="text-sm font-bold text-slate-600 leading-relaxed">
                          {selectedTicket.adminMessage || "Votre demande est en cours de traitement par nos services."}
                       </p>
                       
                       {/* AFFICHAGE DU FICHIER ENVOYÉ PAR L'ADMIN */}
                       {selectedTicket.adminFile && (
                          <div className="mt-4 p-4 bg-indigo-600 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                             <div className="flex items-center gap-3 text-white">
                                <FileText size={20} />
                                <span className="text-[10px] font-black uppercase tracking-tighter truncate w-32">{selectedTicket.adminFile}</span>
                             </div>
                             <Download size={18} className="text-white opacity-60 group-hover:opacity-100" />
                          </div>
                       )}
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Administration • Officiel</span>
                 </div>
              </div>

              <div className="p-8">
                 <button 
                  onClick={() => setSelectedTicket(null)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-100"
                 >
                    Fermer le suivi
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}