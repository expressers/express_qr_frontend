import { useCallback, useEffect, useRef } from "react";

/**
 * Devolve `start()`, que gera um id por pedido, e `isCurrent(id)`.
 * Respostas de pedidos que já não são o último (outro `days`/`id`, ou
 * componente desmontado) são descartadas.
 */
export function useLatestRequest() {
  const requestId = useRef(0);

  useEffect(
    () => () => {
      requestId.current++;
    },
    [],
  );

  const start = useCallback(() => ++requestId.current, []);
  const isCurrent = useCallback((id: number) => id === requestId.current, []);
  return { start, isCurrent };
}
