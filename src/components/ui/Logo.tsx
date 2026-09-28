import { Link } from "react-router-dom";

type LogoProps = {
  className?: string;
  compact?: boolean;
  inverted?: boolean;
};

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className} fill="none">
      <path
        d="M8 10.8A7 7 0 0 1 14.8 4h22.4A6.8 6.8 0 0 1 44 10.8v18.4A6.8 6.8 0 0 1 37.2 36H28l-8.2 7.1c-1.8 1.5-4.5.3-4.5-2.1v-5H14a6 6 0 0 1-6-6V10.8Z"
        fill="currentColor"
      />
      <path
        d="M17 31V18.8c0-3.5 2.4-5.8 6.2-5.8H32M17.2 22h10.5"
        stroke="#F8F5EC"
        strokeWidth="4.25"
        strokeLinecap="round"
      />
      <path
        d="m26.5 29.2 3.2 3.2 7.1-8.2"
        stroke="var(--logo-accent, #C7F36B)"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className = "", compact = false, inverted = false }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Facilitei — página inicial"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <BrandMark
        className={`h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-105 sm:h-10 sm:w-10 ${
          inverted
            ? "text-[#C7F36B] [--logo-accent:#173D36]"
            : "text-primary"
        }`}
      />
      {!compact && (
        <span
          className={`font-display text-[1.42rem] font-extrabold tracking-[-0.06em] sm:text-[1.55rem] ${
            inverted ? "text-[#F5F1E8]" : "text-dark-text"
          }`}
        >
          facil
          <span className={inverted ? "text-[#C7F36B]" : "text-primary"}>
            itei
          </span>
        </span>
      )}
    </Link>
  );
}
