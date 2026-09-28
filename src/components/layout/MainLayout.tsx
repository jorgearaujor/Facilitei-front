import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobilePanelNav } from "./MobilePanelNav";

export function MainLayout() {
  const { pathname } = useLocation();
  const isPanelArea = pathname.startsWith("/painel") || pathname.startsWith("/admin");
  const showFooter = !isPanelArea;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className={`mx-auto w-full max-w-7xl flex-grow px-4 pt-20 sm:px-6 sm:pt-24 lg:px-8 lg:pt-28 ${
          isPanelArea ? "pb-28 lg:pb-20" : "pb-14 sm:pb-20"
        }`}
      >
        <Outlet />
      </main>
      {isPanelArea && <MobilePanelNav />}
      {showFooter && <Footer />}
    </div>
  );
}
