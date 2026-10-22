import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserAccount } from "@/hooks/userAccount";
import { useUserGetMe } from "@/hooks/use_userGetMe";
import { canManage, type AccessInfo } from "@/utils/access";

interface StaffGateProps {
  user: AccessInfo;
  /** `false` enquanto ainda não sabemos o papel (primeira carga de /account/me). */
  settled: boolean;
}

/** Decisão pura do guarda: staff entra, desconhecido espera, o resto volta ao painel. */
function StaffGate({ user, settled }: StaffGateProps) {
  if (canManage(user)) return <Outlet />;

  const known = user.role != null || user.permissions != null;
  if (!known && !settled) {
    return (
      <div className="space-y-4 pt-4" role="status" aria-busy="true">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return <Navigate to="/dashboard" replace />;
}

/**
 * Só STAFF/ADMIN. A API volta a validar cada pedido: isto só evita mostrar
 * uma página vazia a quem não tem acesso.
 */
function StaffRoute() {
  const { state } = useUserAccount();
  const { isSettled } = useUserGetMe();

  return (
    <StaffGate
      settled={isSettled}
      user={{ role: state.user_role, permissions: state.user_permissions }}
    />
  );
}

export { StaffRoute, StaffGate };
