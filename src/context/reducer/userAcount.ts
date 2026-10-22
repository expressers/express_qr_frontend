import { clearSession } from "@/utils/session";
import type { User, UserAction } from "./userTypes";

const EMPTY_USER: User = {
  user_id: null,
  user_name: null,
  user_email: null,
  user_photo: null,
  user_role: null,
  user_phone: null,
};

export function userReducer(state: User, action: UserAction): User {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user_id: action.payload.id ?? null,
        user_name: action.payload.name ?? null,
        user_email: action.payload.email ?? null,
        user_photo: action.payload.photo ?? null,
        user_role: action.payload.role ?? null,
        user_phone: action.payload.phone ?? null,
      };

    case "LOGOUT":
      // Remove token, utilizador e todas as caches `qrcodes-*` da conta.
      clearSession();
      return EMPTY_USER;

    case "UPDATE": {
      const updatedUser = { ...state, ...action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    }

    default:
      return state;
  }
}
