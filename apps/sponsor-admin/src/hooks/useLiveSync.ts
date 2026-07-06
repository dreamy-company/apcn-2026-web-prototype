import { useEffect, useState } from 'react';
import { useStore } from '../state/StoreContext';

/** Ticking "Live · synced Ns ago" readout for the topbar connection chip. */
export function useLiveSync() {
  const { lastSyncAt, connected } = useStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const secondsAgo = Math.max(0, Math.round((now - lastSyncAt) / 1000));
  return { connected, secondsAgo };
}
