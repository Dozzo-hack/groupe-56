import Link from 'next/link';
import { GraduationCap, UserSquare2, ShieldCheck, ArrowRight } from 'lucide-react';
// 1. Importation du connecteur de base de données sécurisé
import dbConnect from '@/lib/dbConnect';

// 2. Transformation de la fonction en "async" pour pouvoir attendre la connexion
export default async function HomePage() {
  
  // 3. Déclenchement de la connexion dès que quelqu'un arrive sur le site
  try {
    await dbConnect();
  } catch (error) {
    // Évite de faire crasher le front-end si la DB coupe, l'erreur sera dans les logs du terminal
    console.error("La base de données n'est pas prête au chargement de la page.");
  }

  const portals = [
    {
      title: "Portail Étudiant",
      desc: "Consultez vos notes, votre emploi du temps et déposez vos devoirs.",
      icon: <GraduationCap size={32} />,
      color: "bg-blue-600",
      link: "/login/student" 
    },
    {
      title: "Espace Enseignant",
      desc: "Gérez vos modules, saisissez les notes et suivez vos classes.",
      icon: <UserSquare2 size={32} />,
      color: "bg-indigo-600",
      link: "/login/teacher" 
    },
    {
      title: "Administration",
      desc: "Validation des PV, gestion des effectifs et configuration système.",
      icon: <ShieldCheck size={32} />,
      color: "bg-slate-900",
      link: "/login/admin" 
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          IUT Gestion Académique v3.0
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter italic mb-6">
          Plateforme <span className="text-indigo-600">Digitale.</span>
        </h1>
        <p className="text-slate-400 font-bold max-w-2xl mx-auto text-lg">
          Accédez à votre espace de travail personnalisé en choisissant votre profil ci-dessous.
        </p>
      </div>

      {/* Portails de Connexion */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 pb-20">
        {portals.map((portal, idx) => (
          <Link 
            key={idx} 
            href={portal.link}
            className="group relative bg-slate-50 p-10 rounded-[3rem] border border-transparent hover:border-indigo-200 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            <div className={`w-16 h-16 ${portal.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
              {portal.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{portal.title}</h3>
            <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8">
              {portal.desc}
            </p>
            <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest">
              Accéder au portail <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      <footer className="text-center py-10 border-t border-slate-50">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2026 IUT University - Système Intégré</p>
      </footer>
    </div>
  );
}