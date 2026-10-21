export type User = {
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_photo: string | null;
  user_role: string | null;
  user_phone: string | null;
  user_city: string | null;
  user_country: string | null;
};

export type UserAction =
  | { type: "LOGIN"; payload: any }
  | { type: "LOGOUT" }
  | { type: "UPDATE"; payload: Partial<User> };
