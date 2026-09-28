import type { ReactNode } from 'react';

type TypographyProps = {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
};

// Mapeamento de estilos base para cada tag
const tagStyles = {
  h1: 'font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-dark-text tracking-[-0.045em]',
  h2: 'font-display text-2xl sm:text-3xl font-bold text-dark-text tracking-[-0.035em]',
  h3: 'font-display text-xl sm:text-2xl font-semibold text-dark-text tracking-[-0.025em]',
  p: 'text-base text-dark-subtle',
  span: 'text-base',
};

export function Typography({ children, as: Tag = 'p', className = '' }: TypographyProps) {
  return <Tag className={`${tagStyles[Tag]} ${className}`}>{children}</Tag>;
}
