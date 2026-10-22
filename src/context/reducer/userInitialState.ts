import type { User } from "./userTypes";

type Stored = Record<string, unknown>;

function readStoredUser(): Stored {
  try {
    const parsed = JSON.parse(localStorage.getItem("user") || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const str = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const user = readStoredUser();

// O reducer guarda o estado com chaves `user_*` (UPDATE) ou `id/name/...` (LOGIN).
export const InitialState: User = {
  user_id: str(user.user_id) ?? str(user.id),
  user_name: str(user.user_name) ?? str(user.name),
  user_email: str(user.user_email) ?? str(user.email),
  user_photo: str(user.user_photo) ?? str(user.photo),
  user_role: str(user.user_role) ?? str(user.role),
  user_phone: str(user.user_phone) ?? str(user.phone),
  user_permissions: Array.isArray(user.user_permissions)
    ? user.user_permissions.filter((p): p is string => typeof p === "string")
    : null,
};
