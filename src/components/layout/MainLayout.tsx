import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* AQUI ESTÁ O PULO DO GATO: 
         Adicionei 'pt-24 md:pt-28' (padding-top) para empurrar o conteúdo 
         para baixo e não ficar escondido atrás do Header fixo.
      */}
      <main className="container mx-auto flex-grow px-4 pb-8 pt-24 sm:px-6 sm:pb-12 md:pt-28">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
