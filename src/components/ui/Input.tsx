import { type ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  name: string;
};

export function Input({ label, name, className = "", ...props }: InputProps) {
  return (
    <div className="relative w-full group">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-dark-subtle mb-1.5 transition-colors group-focus-within:text-accent"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`
          min-h-12 w-full rounded-xl border border-primary/15 bg-dark-background/55 px-4 py-3 text-base sm:rounded-2xl
          text-dark-text placeholder-dark-subtle/50
          transition-all duration-300 ease-out
          focus:outline-none focus:border-primary focus:bg-dark-surface focus:ring-4 focus:ring-primary/10
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
