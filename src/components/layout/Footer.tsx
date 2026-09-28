import { Link } from "react-router-dom";
import { Logo } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-[#102D27] text-[#F5F1E8]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 border-b border-[#F5F1E8]/15 pb-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#F5F1E8]/65">Gente boa encontra gente boa. A plataforma que aproxima você de profissionais locais avaliados pela comunidade.</p>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#C7F36B]">Facilitei</p>
            <div className="flex flex-col gap-3 text-sm text-[#F5F1E8]/75">
              <Link to="/profissionais" className="hover:text-[#F5F1E8]">Encontrar profissional</Link>
              <Link to="/cadastro" className="hover:text-[#F5F1E8]">Quero trabalhar</Link>
              <Link to="/about" className="hover:text-[#F5F1E8]">Como funciona</Link>
            </div>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#C7F36B]">Suporte</p>
            <div className="flex flex-col gap-3 text-sm text-[#F5F1E8]/75">
              <Link to="/faq" className="hover:text-[#F5F1E8]">Central de ajuda</Link>
              <a href="#" className="hover:text-[#F5F1E8]">Termos de uso</a>
              <a href="#" className="hover:text-[#F5F1E8]">Privacidade</a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-[#F5F1E8]/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Facilitei. Feito para resolver.</p>
          <p>Brasil · Português</p>
        </div>
      </div>
    </footer>
  );
}
