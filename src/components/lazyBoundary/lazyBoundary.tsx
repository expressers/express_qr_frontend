import { Component, type ReactNode } from "react";
import { useLang } from "@/hooks";
import { Button } from "../ui";

interface BoundaryProps {
  children: ReactNode;
  message: string;
  retryLabel: string;
}

class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div role="alert" className="mx-auto flex max-w-sm flex-col items-center gap-4 py-24 text-center">
        <p className="text-sm text-muted-foreground">{this.props.message}</p>
        {/* Um chunk que falhou fica em cache no React.lazy; recarregar é o retry fiável. */}
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          {this.props.retryLabel}
        </Button>
      </div>
    );
  }
}

/** Evita o ecrã em branco quando um chunk carregado sob demanda falha. */
function LazyBoundary({ children }: { children: ReactNode }) {
  const { translations } = useLang();
  const t = translations.components.LazyBoundary;
  return (
    <Boundary message={t.error} retryLabel={t.retry}>
      {children}
    </Boundary>
  );
}

export { LazyBoundary };
