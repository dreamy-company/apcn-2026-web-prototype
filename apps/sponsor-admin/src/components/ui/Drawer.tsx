import type { ReactNode } from 'react';
import Icon from './Icon';
import { D } from '../../data/icons';

/** Right-side slide-over used for row detail views (e.g. attendee profile). */
export default function Drawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <aside
        className="absolute inset-y-0 right-0 flex w-full max-w-md animate-fade-in flex-col bg-white shadow-[-16px_0_40px_-20px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-[15px] font-extrabold text-ink">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-line hover:bg-field"
          >
            <Icon d={D.close} s={15} sw={2.2} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  );
}
