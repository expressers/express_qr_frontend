export type User = {
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  user_photo: string | null;
  user_role: string | null;
  user_phone: string | null;
};

export type LoginPayload = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  photo?: string | null;
  role?: string | null;
  phone?: string | null;
};

export type UserAction =
  | { type: "LOGIN"; payload: LoginPayload }
  | { type: "LOGOUT" }
  | { type: "UPDATE"; payload: Partial<User> };
