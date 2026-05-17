"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileEdit, 
  BookOpen, 
  UserCircle, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeacherSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/teacher-dashboard' },
    { name: 'Faire l\'appel', icon: <ClipboardCheck size={20} />, href: '/teacher-dashboard/attendance' },
    { name: 'Saisie des Notes', icon: <FileEdit size={20} />, href: '/teacher-dashboard/grades' },
    { name: 'Mes Modules', icon: <BookOpen size={20} />, href: '/teacher-dashboard/modules' },
    { name: 'Mon Profil', icon: <UserCircle size={20} />, href: '/teacher-dashboard/profile' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
      
      {/* Logo Identique pour la cohérence */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
          <GraduationCap className="text-indigo-600" size={24} />
          UniPortal <span className="text-[10px] bg-indigo-50 px-2 py-0.5 rounded text-indigo-400 font-black uppercase tracking-tighter">Prof</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                : 'text-gray-600 hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              <span className={`${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pied de Sidebar */}
      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium">
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </div>

    </aside>
  );
}