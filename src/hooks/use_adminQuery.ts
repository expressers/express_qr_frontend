import { useCallback, useEffect, useRef, useState } from "react";

interface AdminQueryState<T> {
  data?: T;
  error?: unknown;
  isLoading: boolean;
}

/**
 * Carrega `load()` de novo sempre que `key` muda (filtros, página) ou `reload()` é chamado.
 * Os dados anteriores ficam visíveis enquanto a nova página chega; respostas atrasadas são ignoradas.
 */
function useAdminQuery<T>(load: () => Promise<T>, key: string) {
  const [state, setState] = useState<AdminQueryState<T>>({ isLoading: true });
  const [version, setVersion] = useState(0);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ data: previous.data, isLoading: true }));
    loadRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false });
      })
      .catch((error) => {
        if (!cancelled) setState((previous) => ({ data: previous.data, error, isLoading: false }));
      });
    return () => {
      cancelled = true;
    };
  }, [key, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  return { ...state, reload };
}

/** Valor que só muda `delay` ms depois de parar de mudar (pesquisa enquanto se escreve). */
function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export { useAdminQuery, useDebouncedValue };
