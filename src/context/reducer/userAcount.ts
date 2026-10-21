import type { User, UserAction } from "./userTypes";

export function userReducer(state: User, action: UserAction): User {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user_id: action.payload.id,
        user_name: action.payload.name,
        user_email: action.payload.email,
        user_photo: action.payload.photo,
        user_role: action.payload.role,
        user_phone: action.payload.phone,
        user_city: action.payload.city,
        user_country: action.payload.country,
      };

    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("user_me");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_token_exp");
      localStorage.removeItem("qrcodes");
      return {
        user_id: null,
        user_name: null,
        user_email: null,
        user_photo: null,
        user_role: null,
        user_phone: null,
        user_city: null,
        user_country: null,
      };

    case "UPDATE": {
     
      const updatedUser = { ...state, ...action.payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    }

    default:
      return state;
  }
}
