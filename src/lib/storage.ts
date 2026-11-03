'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const NS = 'avenir2.';
const EVT = 'avenir-storage';

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(NS + key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* storage unavailable — fine, state just won't persist */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: key }));
}

/**
 * State mirrored to localStorage and shared between every component using
 * the same key. Starts at `fallback` on the server and first client render
 * (so markup matches), then loads the stored value. `loaded` says when.
 */
export function useLocalState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setValue(readLocal(key, fallback));
    setLoaded(true);
    const sync = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(readLocal(key, fallback));
    };
    window.addEventListener(EVT, sync);
    return () => window.removeEventListener(EVT, sync);
    // fallback is intentionally not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const ref = useRef(value);
  ref.current = value;

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const v = typeof next === 'function' ? (next as (p: T) => T)(ref.current) : next;
      ref.current = v;
      setValue(v);
      writeLocal(key, v);
    },
    [key],
  );

  return [value, update, loaded] as const;
}

/** The visitor's shortlist of saved homes (property ids). */
export function useSaved() {
  const [saved, setSaved] = useLocalState<string[]>('saved', []);
  const toggle = useCallback(
    (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    [setSaved],
  );
  return { saved, toggle, isSaved: (id: string) => saved.includes(id) };
}
