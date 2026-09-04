import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/10 bg-dark-surface/30 pb-8 pt-12 backdrop-blur-sm sm:pt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mb-12 md:grid-cols-4 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2">
            <Link to="/" className="text-2xl font-extrabold text-white">
              Facilitei<span className="text-accent">.</span>
            </Link>
            <p className="text-dark-subtle max-w-xs leading-relaxed">
              A plataforma líder em conectar necessidades a soluções.
              Transformando serviços locais com tecnologia e confiança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Explorar</h4>
            <ul className="space-y-3 text-dark-subtle">
              <li>
                <Link
                  to="/dashboard/solicitar"
                  className="hover:text-accent transition-colors"
                >
                  Buscar Profissionais
                </Link>
              </li>
              <li>
                <Link
                  to="/cadastro"
                  className="hover:text-accent transition-colors"
                >
                  Ser Profissional
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Suporte</h4>
            <ul className="space-y-3 text-dark-subtle">
              <li>
                <Link to="/faq" className="hover:text-accent transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-center text-sm text-dark-subtle/60 md:flex-row md:text-left">
          <p>
            &copy; {currentYear} Facilitei Ltda. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
