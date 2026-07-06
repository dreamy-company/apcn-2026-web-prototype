import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon';
import { D } from '../../data/icons';

export function BackButton({ light = false, to }: { light?: boolean; to?: string }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="Back"
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] border-[1.5px] transition-colors ${
        light ? 'border-white/25 bg-transparent hover:bg-white/10' : 'border-line bg-white hover:bg-field'
      }`}
    >
      <Icon d={D.back} s={20} c={light ? '#fff' : '#1c1c1c'} sw={2.2} />
    </button>
  );
}

interface PageHeaderProps {
  title: string;
  right?: ReactNode;
  showBack?: boolean;
  backTo?: string;
  children?: ReactNode;
}

/** Dark sticky header used by list/detail screens (ports the prototype's ProgHeader). */
export default function PageHeader({ title, right, showBack = true, backTo, children }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-brand-deep text-white">
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-3.5 py-3 md:px-8">
        {showBack ? <BackButton light to={backTo} /> : <div className="w-10" />}
        <h1 className="flex-1 text-center text-lg font-extrabold tracking-[0.2px] md:text-xl">{title}</h1>
        {right ?? (
          <div className="flex h-10 w-10 items-center justify-center">
            <Icon d={D.search} s={22} c="#fff" sw={2.2} />
          </div>
        )}
      </div>
      {children}
    </header>
  );
}
