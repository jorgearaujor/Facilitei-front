import { motion } from "framer-motion";
import { Typography } from "../components/ui/Typography";
import { Card } from "../components/ui/Card";
import {
  CheckCircleIcon,
  StarIcon,
  WrenchScrewdriverIcon,
} from "../components/ui/Icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function AboutPage() {
  return (
    <motion.div
      className="relative mx-auto max-w-5xl space-y-10 py-6 sm:space-y-16 sm:py-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10" />

      <motion.section className="text-center" variants={itemVariants}>
        <Typography
          as="h1"
          className="mb-5 bg-gradient-to-r from-white to-white/60 bg-clip-text !text-4xl text-transparent sm:mb-6 sm:!text-6xl"
        >
          Sobre o Facilitei
        </Typography>
        <Typography
          as="p"
          className="mx-auto max-w-3xl text-lg leading-relaxed text-dark-subtle sm:text-xl"
        >
          Nossa missão é simplificar a forma como você encontra e contrata
          serviços locais, trazendo mais segurança, praticidade e qualidade para
          o seu dia a dia.
        </Typography>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2" variants={itemVariants}>
          <Card className="h-full border-primary/20 bg-dark-surface/60 p-5 backdrop-blur-md sm:p-12">
            <Typography as="h2" className="text-white mb-4 !text-3xl">
              Nossa Visão
            </Typography>
            <p className="text-lg text-dark-subtle leading-relaxed">
              Acreditamos que todos merecem acesso fácil a profissionais
              qualificados. O Facilitei nasceu da necessidade de criar uma ponte
              segura entre clientes e prestadores, eliminando a incerteza da
              contratação.
            </p>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full border border-accent/20 bg-dark-surface/80 p-5 shadow-glow-accent sm:p-8">
            <Typography
              as="h3"
              className="mb-6 text-center !text-xl text-accent"
            >
              Pilares
            </Typography>
            <ul className="space-y-4">
              {[
                {
                  icon: CheckCircleIcon,
                  title: "Confiança",
                  desc: "Perfis, portfólios e avaliações da comunidade.",
                },
                {
                  icon: StarIcon,
                  title: "Qualidade",
                  desc: "Excelência em cada serviço.",
                },
                {
                  icon: WrenchScrewdriverIcon,
                  title: "Simplicidade",
                  desc: "Sem burocracia.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="rounded-lg bg-accent/10 p-2">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="text-sm text-dark-subtle">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
