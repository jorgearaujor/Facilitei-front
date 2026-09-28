import { type ComponentProps } from "react";

type TextareaProps = ComponentProps<"textarea"> & {
  label?: string;
  name: string;
};

export function Textarea({
  label,
  name,
  className = "",
  ...props
}: TextareaProps) {
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
      <textarea
        id={name}
        name={name}
        className={`
          w-full bg-dark-background/55 border border-primary/15 rounded-2xl px-4 py-3.5
          text-dark-text placeholder-dark-subtle/50 min-h-[120px] resize-y
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
