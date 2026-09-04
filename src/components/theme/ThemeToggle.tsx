import { MoonIcon, SunIcon } from "../ui/Icons";
import { useTheme } from "./themeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "escuro" : "claro";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Ativar tema ${nextTheme}`}
      title={`Ativar tema ${nextTheme}`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-dark-surface/70 text-dark-subtle shadow-sm transition-colors hover:border-primary/40 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-dark-background"
    >
      {theme === "light" ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
}
