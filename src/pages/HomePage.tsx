import { Link, useNavigate } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { CheckIcon } from "../components/ui/Icons";

// Variants melhorados
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleWorkerClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/cadastro");
    }
  };

  return (
    <motion.div
      className="relative space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Efeito de Fundo (Blob) */}
      <div className="pointer-events-none absolute right-[-5%] top-[-10%] -z-10 h-72 w-72 rounded-full bg-primary/20 blur-[100px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[10%] left-[-10%] -z-10 h-64 w-64 rounded-full bg-accent/10 blur-[80px] sm:h-[400px] sm:w-[400px] sm:blur-[100px]" />

      {/* HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 md:pt-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left z-10"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-bold tracking-wide mb-6">
              #1 EM SERVIÇOS LOCAIS
            </span>
            <Typography
              as="h1"
              className="mb-5 !text-4xl leading-tight drop-shadow-lg sm:mb-6 sm:!text-6xl md:!text-7xl"
            >
              Resolva tudo <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary animate-pulse">
                sem complicação.
              </span>
            </Typography>

            <Typography
              as="p"
              className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-dark-subtle sm:mb-10 sm:text-xl lg:mx-0"
            >
              Conectamos você à elite dos profissionais da sua região.
              Segurança, rapidez e qualidade em um único clique.
            </Typography>

            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-5 lg:justify-start">
              <Link to="/dashboard/solicitar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full px-6 py-4 text-base shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(163,230,53,0.5)] sm:w-auto sm:px-10 sm:text-lg"
                >
                  Encontrar Profissional
                </Button>
              </Link>
              <Button
                onClick={handleWorkerClick}
                variant="outline"
                size="lg"
                className="w-full border-dark-subtle/30 px-6 py-4 text-base hover:bg-white/5 sm:w-auto sm:px-10 sm:text-lg"
              >
                Sou Profissional
              </Button>
            </div>
          </motion.div>

          {/* Imagem Hero (Grid Flutuante) */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex relative justify-center"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Imagem Principal Recortada */}
              <div className="absolute inset-4 bg-gradient-to-br from-primary to-accent rounded-[3rem] rotate-3 opacity-20 blur-lg"></div>
              <img
                src="/avatars/trabalhador-2.png"
                className="relative w-full h-full object-cover rounded-[2.5rem] border-8 border-dark-background/50 shadow-2xl z-10"
                alt="Profissional"
              />

              {/* Card Flutuante 2 */}
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-8 -left-8 bg-dark-surface/90 backdrop-blur-xl border border-accent/20 px-6 py-4 rounded-xl shadow-2xl z-30 flex items-center gap-3"
              >
                <div className="bg-accent/20 p-2 rounded-full text-accent">
                  <CheckIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">Garantia Total</p>
                  <p className="text-xs text-dark-subtle">Serviço verificado</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIAS POPULARES (Design de Pílulas Modernas) */}
      <motion.section variants={itemVariants} className="text-center pt-16">
        <Typography
          as="h2"
          className="!text-2xl text-dark-subtle mb-8 uppercase tracking-[0.2em]"
        >
          O que você precisa hoje?
        </Typography>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            "🏠 Reformas",
            "⚡ Elétrica",
            "💧 Encanamento",
            "❄️ Ar Condicionado",
            "🎨 Pintura",
            "🧹 Limpeza",
            "💻 Informática",
          ].map((cat) => (
            <motion.span
              key={cat}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(163, 230, 53, 0.15)",
                borderColor: "rgba(163, 230, 53, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-dark-surface border border-white/5 rounded-full text-white font-medium cursor-pointer transition-all duration-300 hover:text-accent hover:shadow-[0_0_15px_rgba(163,230,53,0.2)]"
            >
              {cat}
            </motion.span>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
