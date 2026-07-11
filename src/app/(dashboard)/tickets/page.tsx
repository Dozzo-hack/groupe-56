"use client";

import React, { useState, useEffect } from 'react';
import { PlusCircle, Clock, CheckCircle2, FileText, Send, X, MessageCircle, Paperclip, Download } from 'lucide-react';

export default function TicketsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({ type: '', description: '' });
  const [file, setFile] = useState<File | null>(null);

  const requestTypes = [
    { id: 'Réclamation Note', label: 'Réclamation (Note manquante / Erreur)' },
    { id: 'Certificat scolarité', label: 'Certificat de scolarité' },
    { id: 'Relevé notes', label: 'Relevé de notes officiel' },
    { id: 'Duplicata carte', label: 'Duplicata de carte d\'étudiant' },
  ];

  // Récupération des tickets
  const fetchTickets = async () => {
    try {
      // Les cookies sont envoyés automatiquement, pas besoin de Headers
      const res = await fetch('/api/student/tickets');
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('type', formData.type);
    data.append('description', formData.description);
    if (file) data.append('file', file);

    try {
      const res = await fetch('/api/student/tickets', {
        method: 'POST',
        body: data // On envoie directement le FormData, le navigateur gère les headers
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ type: '', description: '' });
        setFile(null);
        fetchTickets(); // Rafraîchir la liste
      } else {
        const errorData = await res.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    }
  };

  return (
    <div className="relative space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Mes Requêtes</h1>
          <p className="text-slate-500 text-sm font-medium">Suivez l'avancement de vos demandes.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">
          <PlusCircle size={20} /> Nouvelle requête
        </button>
      </div>

      {/* TABLEAU */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="p-6">ID Requête</th>
              <th className="p-6">Nature</th>
              <th className="p-6">Date</th>
              <th className="p-6">État</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? <tr><td colSpan={5} className="p-6 text-center text-slate-400">Chargement...</td></tr> : tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-slate-50/50 transition-all group">
                <td className="p-6 font-mono text-xs font-bold text-slate-400">{ticket.ticketId}</td>
                <td className="p-6 font-black text-slate-700">{ticket.type}</td>
                <td className="p-6 text-sm font-bold text-slate-500">{new Date(ticket.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="p-6">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    ticket.status === "resolved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {ticket.status === "resolved" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                    {ticket.status === "resolved" ? "Validé" : "En attente"}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => setSelectedTicket(ticket)} className="p-3 bg-slate-100 text-slate-400 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                    <MessageCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL CRÉATION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-8 flex justify-between items-center text-white">
              <div>
                <h2 className="text-2xl font-black tracking-tighter">Soumettre un dossier</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/10 p-3 rounded-2xl hover:bg-white/20"><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Nature du problème</label>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 outline-none">
                  <option value="">Sélectionnez un motif...</option>
                  {requestTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Description</label>
                <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 focus:border-indigo-500 outline-none resize-none" placeholder="Décrivez votre situation..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Pièce justificative</label>
                <div className="relative group">
                    <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept=".pdf,.jpg,.png" />
                    <div className="w-full p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500 transition-all bg-slate-50">
                        <Paperclip size={20} />
                        <span className="text-sm font-black italic">{file ? file.name : "Joindre un document (PDF, JPG)"}</span>
                    </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex justify-center gap-3">
                <Send size={20} /> Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUIVI */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                 <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">{selectedTicket.ticketId}</span>
                    <h3 className="text-xl font-black text-slate-800 mt-2">{selectedTicket.type}</h3>
                 </div>
                 <button onClick={() => setSelectedTicket(null)} className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:text-red-500"><X size={20}/></button>
              </div>

              <div className="p-8 bg-slate-50/50 space-y-6 max-h-[50vh] overflow-y-auto">
                 {/* Affichage sécurisé des messages */}
                 {!selectedTicket.messages || selectedTicket.messages.filter((m: any) => m.sender === 'admin').length === 0 ? (
                   <p className="text-center text-slate-400 font-bold italic text-sm">Votre demande est en cours d'analyse.</p>
                 ) : selectedTicket.messages.filter((m: any) => m.sender === 'admin').map((msg: any, idx: number) => (
                   <div key={idx} className="flex flex-col items-start gap-2">
                      <div className="bg-white p-6 rounded-[2rem] rounded-tl-none shadow-sm border border-slate-100">
                         <p className="text-sm font-bold text-slate-600">{msg.text}</p>
                         {msg.fileUrl && (
                            // CORRECTION ICI : Retrait du localhost:5000 en dur
                            <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="mt-4 p-4 bg-indigo-600 rounded-2xl flex items-center justify-between group hover:bg-indigo-700 shadow-lg shadow-indigo-100">
                               <div className="flex items-center gap-3 text-white">
                                  <FileText size={20} />
                                  <span className="text-[10px] font-black uppercase tracking-tighter truncate w-32">{msg.fileName}</span>
                               </div>
                               <Download size={18} className="text-white opacity-60 group-hover:opacity-100" />
                            </a>
                         )}
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Administration</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}