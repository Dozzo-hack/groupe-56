"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, Send, Paperclip, ArrowLeft, Check, Archive, ChevronRight, FileText, X } from 'lucide-react';

export default function AdminRequestsPro() {
  const [view, setView] = useState<'active' | 'history'>('active');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  
  // States pour la réponse de l'admin
  const [replyText, setReplyText] = useState("");
  const [replyFile, setReplyFile] = useState<File | null>(null);

  // Récupération de tous les tickets côté Admin
  const fetchAllTickets = async () => {
    try {
      // Les cookies de session s'envoient automatiquement
      const res = await fetch('/api/admin/tickets');
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
        
        // Optionnel : Mettre à jour le volet de détails s'il est déjà ouvert
        if (selectedRequest) {
          const updated = data.find((r: any) => r._id === selectedRequest._id);
          if (updated) setSelectedRequest(updated);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des tickets :", error);
    }
  };

  useEffect(() => { 
    fetchAllTickets(); 
  }, []);

  const activeRequests = requests.filter(r => r.status === 'pending');
  const historyRequests = requests.filter(r => r.status === 'resolved');

  // Traitement de l'envoi de réponse / Clôture
  const handleSendReply = async (resolveTicket: boolean = false) => {
    if (!selectedRequest) return;

    // Si on clique sur résoudre sans message, on met un texte par défaut ou on vérifie
    if (!replyText.trim() && !replyFile && !resolveTicket) return;

    const formData = new FormData();
    formData.append('ticketId', selectedRequest._id);
    formData.append('text', replyText);
    if (replyFile) formData.append('file', replyFile);
    if (resolveTicket) formData.append('resolve', 'true');

    try {
      const res = await fetch('/api/admin/tickets/reply', {
        method: 'POST',
        body: formData // Le navigateur gère le Content-Type automatiquement pour le FormData
      });
      
      if (res.ok) {
        setReplyText("");
        setReplyFile(null);
        
        if (resolveTicket) {
          // Si le ticket est clôturé, on ferme le panneau latéral
          setSelectedRequest(null);
        }
        
        // Recharger la liste générale
        await fetchAllTickets();
      } else {
        const errorData = await res.json();
        alert(`Erreur : ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la réponse :", error);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">Support</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Gestion des flux étudiants</p>
        </div>
        
        <div className="flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto w-full md:w-auto">
            <button onClick={() => setView('active')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${view === 'active' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              <Clock size={16} /> En cours ({activeRequests.length})
            </button>
            <button onClick={() => setView('history')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs transition-all whitespace-nowrap ${view === 'history' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>
              <Archive size={16} /> Historique ({historyRequests.length})
            </button>
        </div>
      </div>

      <div className="grid gap-4">
        {(view === 'active' ? activeRequests : historyRequests).map((req) => (
          <div key={req._id} onClick={() => setSelectedRequest(req)} className="group bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-slate-50 hover:border-indigo-500 transition-all shadow-sm hover:shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between cursor-pointer gap-4">
            <div className="flex items-center gap-6">
              <div className={`hidden md:flex w-20 h-20 rounded-[2rem] items-center justify-center transition-all ${req.status === 'pending' ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                {req.status === 'pending' ? <MessageSquare size={32} /> : <CheckCircle size={32} />}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-2 inline-block italic">{req.ticketId}</span>
                <h3 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{req.type}</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">Étudiant : <span className="text-slate-900">{req.student?.name} ({req.student?.classCode})</span></p>
              </div>
            </div>
            <div className="w-full md:w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ChevronRight size={24} className="hidden md:block"/>
              <span className="md:hidden font-black text-sm">Traiter le dossier</span>
            </div>
          </div>
        ))}
        {(view === 'active' ? activeRequests : historyRequests).length === 0 && (
          <p className="text-center text-slate-400 font-bold italic py-10 bg-slate-50/50 rounded-[2rem]">Aucune requête dans cette catégorie.</p>
        )}
      </div>

      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex justify-end">
          <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            
            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
              <div className="flex items-center gap-5">
                <button onClick={() => setSelectedRequest(null)} className="p-3 bg-white rounded-2xl shadow-sm hover:bg-slate-100 transition-all text-slate-500"><ArrowLeft size={20} /></button>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">{selectedRequest.student?.name}</h2>
                  <p className="text-xs font-bold text-indigo-600 tracking-[0.2em] uppercase">{selectedRequest.student?.matricule || 'Pas de matricule'}</p>
                </div>
              </div>
              {selectedRequest.status === 'pending' && (
                  <button onClick={() => handleSendReply(true)} className="flex w-full md:w-auto items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
                    <Check size={20} /> Résoudre & Clôturer
                  </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] px-2">Objet de la demande</h4>
                <div className="bg-slate-50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
                  <p className="text-base md:text-lg font-bold text-slate-700 leading-relaxed italic">"{selectedRequest.description}"</p>
                  
                  {selectedRequest.attachmentUrl && (
                    <div className="mt-6 flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100">
                      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={20}/></div>
                      <span className="flex-1 text-sm font-black text-slate-600 truncate">{selectedRequest.attachmentName || "Justificatif"}</span>
                      <a href={selectedRequest.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100">VOIR</a>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequest.messages && selectedRequest.messages.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] px-2 text-center">Historique des réponses</h4>
                    {selectedRequest.messages.map((msg: any, i: number) => (
                        <div key={i} className={`flex flex-col gap-2 ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                            <div className={`${msg.sender === 'admin' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-600 rounded-tl-none'} px-6 py-4 rounded-[2rem] max-w-[85%] shadow-sm`}>
                                <p className="text-sm font-bold">{msg.text}</p>
                                {msg.fileUrl && (
                                   <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 p-3 rounded-xl border flex items-center gap-3 transition-all ${msg.sender === 'admin' ? 'bg-indigo-700 border-indigo-500 hover:bg-indigo-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                      <FileText size={16} className={msg.sender === 'admin' ? 'text-indigo-200' : 'text-slate-400'}/>
                                      <span className={`text-[10px] font-black italic uppercase tracking-tighter truncate max-w-[150px] ${msg.sender === 'admin' ? 'text-white' : 'text-slate-600'}`}>{msg.fileName || "Fichier joint"}</span>
                                   </a>
                                )}
                            </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>

            {selectedRequest.status === 'pending' && (
                <div className="p-4 md:p-8 bg-white border-t border-slate-100">
                  <div className="flex flex-col gap-4">
                     <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-[2.5rem] border border-slate-100">
                       <label className="p-4 bg-white text-slate-400 rounded-full cursor-pointer hover:text-indigo-600 shadow-sm transition-all flex items-center gap-2 shrink-0">
                         <Paperclip size={20} />
                         {replyFile && <span className="hidden md:inline text-[10px] font-bold text-indigo-600 truncate max-w-[80px]">{replyFile.name}</span>}
                         <input type="file" onChange={e => setReplyFile(e.target.files?.[0] || null)} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                       </label>
                       
                       <input 
                         type="text" 
                         value={replyText}
                         onChange={e => setReplyText(e.target.value)}
                         placeholder="Votre réponse officielle..." 
                         className="flex-1 bg-transparent px-2 font-bold text-slate-700 outline-none w-full"
                         onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(false); }}
                       />
                       <button onClick={() => handleSendReply(false)} className="w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 shrink-0">
                         <Send size={24} />
                       </button>
                     </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}