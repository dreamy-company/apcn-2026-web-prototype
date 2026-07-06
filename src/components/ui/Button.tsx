import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';

type Variant = 'primary' | 'light' | 'soft' | 'outline' | 'outlineOnSurface' | 'social';

const styles: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-[0_12px_26px_-8px_rgba(241,90,36,0.6)] hover:bg-[#e0501d] active:scale-[0.99]',
  light:
    'bg-white text-brand shadow-[0_12px_26px_-10px_rgba(0,0,0,0.35)] hover:bg-brand-soft active:scale-[0.99]',
  soft: 'bg-brand-soft text-brand hover:bg-[#fbdfc9] active:scale-[0.99]',
  outline: 'bg-transparent text-ink border-[1.5px] border-line hover:bg-field active:scale-[0.99]',
  outlineOnSurface:
    'bg-transparent text-white border-[1.5px] border-white/35 hover:bg-white/10 active:scale-[0.99]',
  social: 'bg-white text-ink border-[1.5px] border-line font-semibold hover:bg-field active:scale-[0.99]',
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  icon?: ReactNode;
  trailingIcon?: string;
  to?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export default function Button({
  children,
  variant = 'primary',
  icon,
  trailingIcon,
  to,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const cls = `flex h-14 w-full items-center justify-center gap-2.5 rounded-[18px] px-5 text-[16px] font-bold transition-all duration-150 ${styles[variant]} ${className}`;
  const inner = (
    <>
      {icon}
      {children}
      {trailingIcon && <Icon d={trailingIcon} s={18} sw={2.4} />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
