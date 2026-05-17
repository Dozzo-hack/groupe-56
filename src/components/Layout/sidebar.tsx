"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  ClipboardList, 
  UserCircle, 
  LogOut,
  Clock // On garde l'icône pour les présences
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // Liste des menus : J'ai remis tes liens originaux et ajouté Présences
  const menuItems = [
    { name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, href: '/dashboard' },
    { name: 'Mes Cours', icon: <BookOpen size={20} />, href: '/courses' },
    { name: 'Présences', icon: <Clock size={20} />, href: '/attendance' }, // Juste l'ajout ici
    { name: 'Notes & Examens', icon: <GraduationCap size={20} />, href: '/grades' },
    { name: 'Requêtes / Tickets', icon: <ClipboardList size={20} />, href: '/tickets' },
    { name: 'Mon Profil', icon: <UserCircle size={20} />, href: '/profile' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      
      {/* Header de la Sidebar */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <GraduationCap className="text-blue-600" />
          UniPortal
        </h2>
      </div>

      {/* Liens du Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          // Vérification si le lien est actif pour garder le style visuel
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className={`${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'} transition-colors`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bas de la Sidebar - Déconnexion */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>

    </aside>
  );
}