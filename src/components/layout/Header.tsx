import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { api, ensureCsrfToken, refreshCsrfToken } from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { ArrowUpRightIcon, MenuIcon, XMarkIcon } from "../ui/Icons";
import { Logo } from "../ui/Logo";
import { ThemeToggle } from "../theme/ThemeToggle";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { disablePushNotifications } from "../../lib/pushNotifications";

type NavigationLink = {
  to: string;
  label: string;
  end?: boolean;
};

const publicLinks: NavigationLink[] = [
  { to: "/", label: "Início", end: true },
  { to: "/profissionais", label: "Profissionais" },
  { to: "/about", label: "Como funciona" },
  { to: "/faq", label: "Ajuda" },
];

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPanelArea = pathname.startsWith("/painel");
  const isAdminArea = pathname.startsWith("/admin");
  const profilePath = user ? "/painel/perfil" : "/login";

  const navigationLinks = useMemo<NavigationLink[]>(() => {
    if (isAdminArea && user?.admin) {
      return [
        { to: "/admin", label: "Visão geral", end: true },
        { to: "/painel/suporte", label: "Meus atendimentos" },
        { to: "/painel", label: "Meu painel" },
      ];
    }

    if (!isPanelArea || !user) return publicLinks;

    return [
      { to: "/painel", label: "Visão geral", end: true },
      ...(user.role === "cliente"
        ? [{ to: "/profissionais", label: "Encontrar profissionais" }]
        : [{ to: "/painel/assinatura", label: "Assinatura" }]),
      { to: profilePath, label: "Meu perfil" },
      { to: "/painel/suporte", label: "Suporte" },
      ...(user.admin ? [{ to: "/admin", label: "Admin" }] : []),
      { to: "/painel/configuracoes", label: "Configurações" },
    ];
  }, [isAdminArea, isPanelArea, profilePath, user]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  const handleLogout = async () => {
    try {
      await disablePushNotifications().catch(() => undefined);
      await ensureCsrfToken();
      await api.post("/auth/logout");
    } catch {
      // A sessão local também precisa ser encerrada se a API estiver indisponível.
    } finally {
      logout();
      await refreshCsrfToken().catch(() => undefined);
      setIsMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled || isPanelArea || isAdminArea
            ? "border-b border-primary/10 bg-dark-background/92 py-2.5 shadow-sm backdrop-blur-xl sm:py-3"
            : "border-b border-primary/10 bg-dark-background/92 py-2.5 backdrop-blur-xl sm:py-3 lg:border-transparent lg:bg-transparent lg:py-5 lg:backdrop-blur-none"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            {(isPanelArea || isAdminArea) && (
              <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-primary">
                {isAdminArea ? "Admin" : "Painel"}
              </span>
            )}
          </div>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label={isPanelArea || isAdminArea ? "Navegação do painel" : "Navegação principal"}
          >
            {navigationLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-dark-subtle hover:bg-primary/5 hover:text-dark-text"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && user && <NotificationCenter />}

            <div className="hidden items-center gap-2 lg:flex">
              <ThemeToggle />
              {isAuthenticated && user ? (
                <>
                {isPanelArea ? (
                  <Button size="sm" variant="ghost" onClick={() => navigate("/")}>
                    Ver site
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/painel")}
                  >
                    Meu painel
                  </Button>
                )}
                <Link
                  to={profilePath}
                  className="ml-1 flex items-center gap-3 rounded-full border border-primary/10 bg-dark-surface py-1 pl-1 pr-4"
                >
                  <Avatar
                    src={user.avatarUrl}
                    name={user.nome}
                    className="h-9 w-9 rounded-full"
                  />
                  <span className="text-sm font-bold text-dark-text">
                    {user.nome.split(" ")[0]}
                  </span>
                </Link>
                <Button size="sm" variant="ghost" onClick={handleLogout}>
                  Sair
                </Button>
                </>
              ) : (
                <>
                <Button size="sm" variant="ghost" onClick={() => navigate("/login")}>
                  Entrar
                </Button>
                <Button size="sm" onClick={() => navigate("/cadastro")}>
                  Criar conta
                </Button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
              className="flex h-11 w-11 touch-manipulation items-center justify-center rounded-2xl border border-primary/15 bg-dark-surface text-dark-text shadow-sm lg:hidden"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 z-[60] flex items-end bg-black/45 text-[#F5F1E8] backdrop-blur-sm lg:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              onClick={(event) => event.stopPropagation()}
              className="safe-bottom flex max-h-[88dvh] w-full flex-col rounded-t-[2rem] bg-[#102D27] px-5 pb-4 pt-3 shadow-2xl"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#F5F1E8]/20" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Logo inverted />
                  {(isPanelArea || isAdminArea) && (
                    <span className="rounded-full border border-[#C7F36B]/30 bg-[#C7F36B]/10 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#C7F36B]">
                      {isAdminArea ? "Admin" : "Painel"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#F5F1E8]/20"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <nav
                className="my-5 flex flex-col overflow-y-auto"
                aria-label={isPanelArea || isAdminArea ? "Navegação do painel" : "Navegação principal"}
              >
                {navigationLinks.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex min-h-14 items-center justify-between border-b border-[#F5F1E8]/15 py-3.5 font-display text-2xl font-bold tracking-tight"
                    >
                      {link.label}
                      <ArrowUpRightIcon className="h-6 w-6 text-[#C7F36B]" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  {isAuthenticated && user ? (
                    <div className="flex flex-1 gap-3">
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          navigate(isPanelArea ? "/" : "/painel");
                          setIsMenuOpen(false);
                        }}
                      >
                        {isPanelArea ? "Ver site" : "Meu painel"}
                      </Button>
                      <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={handleLogout}
                      >
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        className="flex-1 !border-[#F5F1E8]/30 !text-[#F5F1E8]"
                        variant="outline"
                        onClick={() => {
                          navigate("/login");
                          setIsMenuOpen(false);
                        }}
                      >
                        Entrar
                      </Button>
                      <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={() => {
                          navigate("/cadastro");
                          setIsMenuOpen(false);
                        }}
                      >
                        Criar conta
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
