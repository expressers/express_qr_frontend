import type { User } from "./userTypes";

function readStoredUser(): Record<string, string | null> {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

const user = readStoredUser();

// O reducer guarda o estado com chaves `user_*` (UPDATE) ou `id/name/...` (LOGIN).
export const InitialState: User = {
  user_id: user?.user_id ?? user?.id ?? null,
  user_name: user?.user_name ?? user?.name ?? null,
  user_email: user?.user_email ?? user?.email ?? null,
  user_photo: user?.user_photo ?? user?.photo ?? null,
  user_role: user?.user_role ?? user?.role ?? null,
  user_phone: user?.user_phone ?? user?.phone ?? null,
};
