import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useState, useEffect } from 'react';

export type DragPayload = { type: 'project'; id: string };

interface DragCtx {
  payload: DragPayload | null;
  draggingId: string | null;
  hoverZone: string | null;
  setDrag: (p: DragPayload | null) => void;
  setHover: (zoneId: string | null) => void;
  /** Fallback for touch: tap a card then tap a zone */
  tappedId: string | null;
  tap: (id: string) => void;
  clearTap: () => void;
}

const Ctx = createContext<DragCtx | null>(null);

export function DragProvider({ children }: { children: ReactNode }) {
  const [payload, setPayload] = useState<DragPayload | null>(null);
  const [hoverZone, setHoverZone] = useState<string | null>(null);
  const [tappedId, setTappedId] = useState<string | null>(null);

  const setDrag = useCallback((p: DragPayload | null) => {
    setPayload(p);
    if (p === null) setHoverZone(null);
  }, []);

  const setHover = useCallback((zoneId: string | null) => setHoverZone(zoneId), []);

  const tap = useCallback((id: string) => {
    setTappedId((cur) => (cur === id ? null : id));
  }, []);

  const clearTap = useCallback(() => setTappedId(null), []);

  // clear stale drag state on escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPayload(null);
        setHoverZone(null);
        setTappedId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Ctx.Provider
      value={{
        payload,
        draggingId: payload?.id ?? null,
        hoverZone,
        setDrag,
        setHover,
        tappedId,
        tap,
        clearTap,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useDrag() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDrag must be used within DragProvider');
  return ctx;
}
