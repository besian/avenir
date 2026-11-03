'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CommandPalette } from './CommandPalette';

interface UI {
  openPalette: () => void;
  closePalette: () => void;
  toast: (msg: string) => void;
}

const Ctx = createContext<UI | null>(null);

export interface PaletteHome { id: string; title: string; area: string; avail: string; type: string }

export function useUI() {
  const ui = useContext(Ctx);
  if (!ui) throw new Error('useUI must be used inside <UIProvider>');
  return ui;
}

export function UIProvider({ children, homes }: { children: ReactNode; homes: PaletteHome[] }) {
  const [pal, setPal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((msg: string) => {
    clearTimeout(timer.current);
    setToastMsg(msg);
    timer.current = setTimeout(() => setToastMsg(''), 2600);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  // ⌘K / Ctrl+K toggles, "/" opens (when not typing), Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (/INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPal((v) => !v);
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        setPal(true);
      } else if (e.key === 'Escape') {
        setPal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo<UI>(() => ({ openPalette: () => setPal(true), closePalette: () => setPal(false), toast }), [toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {toastMsg && (
        <div role="status" className="toast">
          {toastMsg}
        </div>
      )}
      {pal && <CommandPalette homes={homes} onClose={() => setPal(false)} />}
    </Ctx.Provider>
  );
}
