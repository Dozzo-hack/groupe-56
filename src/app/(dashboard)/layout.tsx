import Sidebar from "@/components/Layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* On place notre composant Sidebar ici */}
      <Sidebar />

      {/* Le "main" contiendra le contenu de chaque page (notes, cours, etc.) */}
      {/* "ml-64" laisse la place pour la sidebar de 64px de large */}
      <main className="flex-1 ml-64 min-h-screen bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
}