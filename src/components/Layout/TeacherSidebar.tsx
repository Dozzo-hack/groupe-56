"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileEdit, 
  BookOpen, 
  UserCircle, 
  GraduationCap,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TeacherNav() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={24} />, href: '/teacher-dashboard' },
    { name: 'Appel', icon: <ClipboardCheck size={24} />, href: '/teacher-dashboard/attendance' },
    { name: 'Notes', icon: <FileEdit size={24} />, href: '/teacher-dashboard/grades' },
    { name: 'Modules', icon: <BookOpen size={24} />, href: '/teacher-dashboard/modules' },
    { name: 'Profil', icon: <UserCircle size={24} />, href: '/teacher-dashboard/profile' },
  ];

  return (
    <>
      {/* 1. SIDEBAR (Uniquement pour Desktop - md:) */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-50">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <GraduationCap size={24} /> UniPortal
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-slate-50'}`}>
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl font-medium">
            <LogOut size={20} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* 2. BOTTOM NAVBAR (Uniquement pour Mobile - md:hidden) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe pt-2 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex flex-col items-center justify-center w-full h-full gap-1 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                {item.icon}
                <span className="text-[10px] font-bold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}