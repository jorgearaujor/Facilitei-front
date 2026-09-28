import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "./Icons";

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type SelectProps<T extends string> = {
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};

export function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder = "Selecione uma opção",
  ariaLabel,
  disabled = false,
  className = "",
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-primary/15 bg-dark-background/80 px-4 py-3 text-left text-sm text-dark-text shadow-sm outline-none transition hover:border-primary/35 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={selected ? "font-medium" : "text-dark-subtle"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 shrink-0 text-primary transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-primary/15 bg-dark-surface p-1.5 shadow-2xl shadow-black/30"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  isSelected
                    ? "bg-primary/15 font-semibold text-primary"
                    : "text-dark-text hover:bg-white/5"
                } disabled:cursor-not-allowed disabled:opacity-40`}
              >
                <span>{option.label}</span>
                {isSelected && <CheckIcon className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
