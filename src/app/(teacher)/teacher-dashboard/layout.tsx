import TeacherSidebar from "@/components/Layout/TeacherSidebar"; // Vérifie bien le chemin de l'import

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* 1. On affiche la Sidebar ici */}
      <TeacherSidebar />

      {/* 2. On ajoute pl-64 (256px) pour ne pas que le contenu passe sous la sidebar fixed */}
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  );
}