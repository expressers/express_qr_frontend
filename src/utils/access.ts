/** Papéis internos com acesso ao painel de gestão. */
const MANAGEMENT_ROLES = ["STAFF", "ADMIN"];
/** Permissão devolvida por `GET /api/account/me` que abre a gestão de utilizadores. */
const MANAGEMENT_PERMISSION = "user:read:any";

export interface AccessInfo {
  role?: string | null;
  permissions?: readonly string[] | null;
}

/** STAFF/ADMIN, por permissões do servidor ou, na falta delas, pelo papel. */
export function canManage(user: AccessInfo | null | undefined): boolean {
  if (!user) return false;
  if (user.permissions?.includes(MANAGEMENT_PERMISSION)) return true;
  return Boolean(user.role && MANAGEMENT_ROLES.includes(user.role));
}
