import { canManage } from "@/utils/access";
import { useUserAccount } from "./userAccount";

/** `true` para STAFF/ADMIN (permissões de /account/me ou papel). */
function useCanManage(): boolean {
  const { state } = useUserAccount();
  return canManage({ role: state.user_role, permissions: state.user_permissions });
}

export { useCanManage };
