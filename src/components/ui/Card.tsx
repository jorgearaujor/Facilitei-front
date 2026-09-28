import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type CardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  className?: string;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Card({ children, className = "", ...props }: CardProps) {
  const variants = props.variants || cardVariants;

  return (
    <motion.div
      variants={variants}
      
      className={`
        bg-dark-surface/90
        rounded-[1.25rem] sm:rounded-[1.5rem]
        border border-primary/15
        transition-all duration-300
        shadow-soft
        hover:border-primary/30
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
