import { createContext, useContext, useState, type ReactNode } from 'react';
import { HOTELS } from '../data/hotels';

export type HotelSelection = 'all' | string;

interface HotelCtx {
  selected: HotelSelection; // 'all' = aggregated global summary
  setSelected: (id: HotelSelection) => void;
}

const Ctx = createContext<HotelCtx | null>(null);

/** The context switcher's single source of truth. `?hotel=<id>` seeds it. */
export function HotelProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<HotelSelection>(() => {
    const param = new URLSearchParams(window.location.search).get('hotel');
    return param && HOTELS.some((h) => h.id === param) ? param : 'all';
  });
  return <Ctx.Provider value={{ selected, setSelected }}>{children}</Ctx.Provider>;
}

export function useHotel(): HotelCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useHotel outside HotelProvider');
  return ctx;
}
