import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-slate-50 shadow-glow-primary hover:bg-primary-hover border border-primary",
  secondary:
    "bg-[#C7F36B] text-[#122A24] font-extrabold shadow-glow-accent hover:bg-[#D6FA87] border border-[#A8D750]",
  outline:
    "bg-transparent border border-primary/35 text-primary hover:bg-primary/10 hover:border-primary",
  ghost: "bg-transparent text-dark-subtle hover:text-dark-text hover:bg-primary/5",
  danger:
    "bg-status-danger/10 text-status-danger border border-status-danger/50 hover:bg-status-danger hover:text-slate-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-sm",
  md: "min-h-12 px-5 py-3 text-sm sm:px-6 sm:text-base",
  lg: "min-h-12 px-6 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className={`
        relative inline-flex touch-manipulation items-center justify-center gap-2 rounded-full font-bold transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-background focus:ring-accent
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
