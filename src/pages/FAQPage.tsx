import { AccordionItem } from "../components/ui/Accordion";
import { Typography } from "../components/ui/Typography";
import { Card } from "../components/ui/Card";
import { motion } from "framer-motion";

export function FAQPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl py-6 sm:py-12"
    >
      <div className="mb-10 text-center sm:mb-16">
        <Typography as="h1" className="mb-4 !text-3xl font-bold sm:!text-4xl md:!text-5xl">
          Dúvidas Frequentes
        </Typography>
        <p className="text-lg text-dark-subtle sm:text-xl">
          Tudo o que você precisa saber para usar o Facilitei.
        </p>
      </div>

      <Card className="divide-y divide-white/10 bg-dark-surface/50 backdrop-blur-md border-primary/20">
        <AccordionItem title="Como funciona o pagamento?">
          <p>
            O pagamento é negociado livremente entre você e o profissional. O
            Facilitei conecta as partes, mas não retém valores, garantindo que
            100% do valor vá para quem trabalhou.
          </p>
        </AccordionItem>
        <AccordionItem title="Os profissionais são verificados?">
          <p>
            Sim! Realizamos uma verificação de antecedentes e documentos de
            todos os profissionais cadastrados para garantir a segurança da
            comunidade.
          </p>
        </AccordionItem>
        <AccordionItem title="E se o serviço não for concluído?">
          <p>
            Você pode reportar o problema através do nosso suporte. Temos uma
            equipe pronta para mediar conflitos e garantir que ninguém saia no
            prejuízo.
          </p>
        </AccordionItem>
        <AccordionItem title="Como cancelo um serviço?">
          <p>
            Acesse seu Dashboard, encontre o serviço e clique em "Contestar" ou
            entre em contato via chat com o profissional para reagendar.
          </p>
        </AccordionItem>
      </Card>
    </motion.div>
  );
}
