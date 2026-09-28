import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import {
  CogIcon,
  CreditCardIcon,
  DashboardIcon,
  SearchIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
} from "../ui/Icons";

export function MobilePanelNav() {
  const { user } = useAuthStore();

  if (!user) return null;

  const action =
    user.role === "cliente"
      ? { to: "/profissionais", label: "Buscar", icon: SearchIcon }
      : { to: "/painel/assinatura", label: "Plano", icon: CreditCardIcon };

  const links = [
    { to: "/painel", label: "Painel", icon: DashboardIcon, end: true },
    action,
    { to: "/painel/suporte", label: "Suporte", icon: ChatBubbleLeftRightIcon },
    user.admin
      ? { to: "/admin", label: "Admin", icon: ShieldCheckIcon }
      : { to: "/painel/perfil", label: "Perfil", icon: UserIcon },
    { to: "/painel/configuracoes", label: "Ajustes", icon: CogIcon },
  ];

  return (
    <nav
      aria-label="Navegação rápida do painel"
      className="safe-bottom fixed inset-x-3 bottom-2 z-40 grid grid-cols-5 rounded-[1.35rem] border border-primary/15 bg-dark-surface/95 px-1.5 pt-1.5 shadow-[0_18px_60px_-18px_rgba(0,0,0,.55)] backdrop-blur-xl lg:hidden"
    >
      {links.map(({ to, label, icon: Icon, ...link }) => (
        <NavLink
          key={to}
          to={to}
          end={"end" in link ? link.end : false}
          className={({ isActive }) =>
            `flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-bold transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-dark-subtle active:bg-primary/5"
            }`
          }
        >
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
