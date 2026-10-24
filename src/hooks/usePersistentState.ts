import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'project-graveyard:state:v1';

export function usePersistentState<T>(initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...initial, ...JSON.parse(raw) } as T;
    } catch {
      /* ignore */
    }
    return initial;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const reset = useCallback(() => setState(initial), [initial]);

  return [state, setState, reset] as const;
}
