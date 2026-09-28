import { motion, type Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { BookIcon, BuildingIcon, HomeIcon, LeafIcon, WrenchIcon } from "../components/ui/CategoryIcons";
import { CheckIcon, StarIcon } from "../components/ui/Icons";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const categories = [
  { label: "Reformas", icon: BuildingIcon, tone: "bg-[#FFD8C8]" },
  { label: "Casa e limpeza", icon: HomeIcon, tone: "bg-[#DDE8FF]" },
  { label: "Reparos técnicos", icon: WrenchIcon, tone: "bg-[#E6F4C9]" },
  { label: "Jardinagem", icon: LeafIcon, tone: "bg-[#D7EDDA]" },
  { label: "Aulas", icon: BookIcon, tone: "bg-[#F5DFC2]" },
];

const steps = [
  { number: "01", title: "Conte o que precisa", text: "Descreva o serviço, escolha a categoria e diga quando quer resolver." },
  { number: "02", title: "Compare com calma", text: "Veja perfis, avaliações e especialidades antes de escolher." },
  { number: "03", title: "Combine e acompanhe", text: "Converse pelo chat e acompanhe tudo em um só lugar." },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="space-y-16 pb-4 sm:space-y-24 sm:pb-8 lg:space-y-32">
      <section className="relative -mx-4 overflow-hidden rounded-b-[2rem] bg-[#173D36] px-5 pb-7 pt-9 text-[#F5F1E8] sm:mx-0 sm:rounded-[2.25rem] sm:px-10 sm:pb-10 sm:pt-14 lg:min-h-[680px] lg:rounded-[2.75rem] lg:px-16 lg:pt-16">
        <div className="paper-noise pointer-events-none absolute inset-0 opacity-20" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[70px] border-[#C7F36B]/10" />
        <div className="relative z-10 grid items-center gap-9 sm:gap-12 lg:grid-cols-[1.05fr_.95fr]">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.12 }}>
            <motion.div variants={fadeUp} className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#F5F1E8]/15 bg-[#F5F1E8]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#C7F36B]">
              <span className="h-2 w-2 rounded-full bg-[#C7F36B]" /> Profissionais perto de você
            </motion.div>
            <motion.h1 variants={fadeUp} className="balance max-w-3xl font-display text-[2.55rem] font-extrabold leading-[1.02] tracking-[-0.055em] min-[380px]:text-[2.85rem] sm:text-6xl lg:text-[4.65rem]">
              Seu serviço,<br /><span className="text-[#C7F36B]">bem resolvido.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-7 text-[#F5F1E8]/70 sm:text-lg sm:leading-8">
              Encontre profissionais confiáveis da sua região para tirar planos do papel — sem indicação duvidosa e sem perder tempo.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link to="/profissionais" className="block w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full px-7 sm:w-auto">Encontrar profissional <span aria-hidden>→</span></Button>
              </Link>
              <Button variant="outline" size="lg" onClick={() => navigate(user?.role === "trabalhador" ? "/painel" : "/cadastro")} className="w-full !border-[#F5F1E8]/30 !text-[#F5F1E8] hover:!border-[#F5F1E8]/60 hover:bg-[#F5F1E8]/10 sm:w-auto">
                Quero oferecer serviços
              </Button>
            </motion.div>
            <motion.div variants={fadeUp} className="mt-7 grid grid-cols-1 gap-2 text-xs text-[#F5F1E8]/65 min-[390px]:grid-cols-2 sm:mt-10 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-3 sm:text-sm">
              {["Cadastro gratuito", "Perfis detalhados", "Avaliações reais"].map((item) => (
                <span key={item} className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C7F36B] text-[#173D36]"><CheckIcon className="h-3 w-3 stroke-[3]" /></span>{item}</span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96, rotate: 1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.75, delay: 0.15 }} className="relative mx-auto w-full max-w-[500px] lg:mt-4">
            <div className="absolute -inset-3 rotate-3 rounded-[2rem] bg-[#C7F36B]" />
            <div className="relative overflow-hidden rounded-[1.65rem] border-4 border-[#F5F1E8]/90 bg-[#E8E5DC] shadow-2xl">
              <img src="/avatars/trabalhador-2.png" alt="Profissional de reformas sorrindo" className="aspect-[16/12] w-full object-cover object-[55%_35%] sm:aspect-[4/4.45] sm:object-[55%_center]" />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/95 p-4 text-[#173D36] shadow-xl backdrop-blur sm:inset-x-6 sm:bottom-6">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="font-display text-base font-bold">Escolha com mais contexto</p><p className="mt-1 text-xs text-[#536B64]">Veja portfólio, especialidades e avaliações</p></div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#C7F36B]"><CheckIcon className="h-5 w-5 stroke-[2.5]" /></div>
                </div>
              </div>
            </div>
            <div className="absolute -left-1 top-5 flex rotate-[-5deg] items-center gap-1 rounded-xl bg-[#FF7E5F] px-3 py-2 text-xs font-extrabold text-[#173D36] shadow-lg sm:-left-8 sm:top-10 sm:px-4 sm:py-3 sm:text-sm">
              <StarIcon className="h-4 w-4" /> 4,9 média
            </div>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Comece por aqui</p>
            <h2 className="balance font-display text-3xl font-extrabold tracking-[-0.045em] text-dark-text sm:text-5xl">O que você quer resolver hoje?</h2>
          </div>
          <Link to="/profissionais" className="text-sm font-bold text-primary hover:underline">Ver todas as categorias →</Link>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
          {categories.map(({ label, icon: Icon, tone }, index) => (
            <motion.button key={label} type="button" onClick={() => navigate("/profissionais")} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }} whileHover={{ y: -6 }} className="group min-w-[72vw] snap-start rounded-[1.25rem] border border-primary/10 bg-dark-surface p-5 text-left shadow-soft transition-colors hover:border-primary/30 sm:min-w-0 sm:rounded-[1.5rem]">
              <span className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl sm:mb-8 ${tone} text-[#173D36]`}><Icon className="h-6 w-6" /></span>
              <span className="flex items-center justify-between gap-3 font-display text-base font-bold text-dark-text">{label}<span className="text-primary transition-transform group-hover:translate-x-1">→</span></span>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="grid overflow-hidden rounded-[2rem] border border-primary/10 bg-dark-surface shadow-soft lg:grid-cols-[.85fr_1.15fr]">
        <div className="relative min-h-[280px] overflow-hidden bg-[#FFD8C8] sm:min-h-[360px] lg:min-h-[560px]">
          <img src="/avatars/trabalhador-1.png" alt="Profissional da plataforma" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute bottom-5 left-5 rounded-2xl bg-[#173D36] px-5 py-4 text-[#F5F1E8] shadow-xl">
            <p className="text-2xl font-extrabold text-[#C7F36B]">+ confiança</p><p className="mt-1 text-xs text-[#F5F1E8]/65">para contratar sem dúvida</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em] text-primary">Simples de verdade</p>
          <h2 className="balance font-display text-3xl font-extrabold tracking-[-0.045em] text-dark-text sm:text-5xl">Do pedido ao pronto em três passos.</h2>
          <div className="mt-9 space-y-2">
            {steps.map((step) => (
              <div key={step.number} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-primary/15 py-5 first:border-t-0">
                <span className="font-display text-sm font-bold text-primary">{step.number}</span>
                <div><h3 className="font-display text-lg font-bold text-dark-text">{step.title}</h3><p className="mt-1 text-sm leading-6 text-dark-subtle">{step.text}</p></div>
              </div>
            ))}
          </div>
          <Link to="/profissionais" className="mt-5"><Button className="w-full sm:w-auto">Encontrar profissional <span aria-hidden>→</span></Button></Link>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[2rem] bg-[#FF7E5F] px-6 py-12 text-[#173D36] sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
        <div className="absolute right-[-2rem] top-[-4rem] font-display text-[14rem] font-black leading-none text-[#F5F1E8]/12">F</div>
        <div className="relative max-w-2xl">
          <p className="mb-4 text-xs font-extrabold uppercase tracking-[0.18em]">Para quem faz acontecer</p>
          <h2 className="balance font-display text-3xl font-extrabold tracking-[-0.045em] sm:text-5xl">Seu talento merece mais clientes.</h2>
          <p className="mt-4 max-w-xl leading-7 text-[#173D36]/75">Crie seu perfil, mostre seus trabalhos e receba oportunidades perto de você. A assinatura profissional é exibida com transparência antes da ativação.</p>
        </div>
        <Button onClick={() => navigate("/cadastro")} className="relative mt-8 w-full shrink-0 bg-[#173D36] px-7 text-[#F5F1E8] hover:bg-[#0C2D27] sm:w-auto lg:mt-0">Quero fazer parte →</Button>
      </section>
    </div>
  );
}
