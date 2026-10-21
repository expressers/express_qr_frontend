const userStorage = localStorage.getItem("user");
const user = JSON.parse(userStorage || "{}");

export const InitialState = {
  user_id: user?.id || null,
  user_name: user?.name || null,
  user_email: user?.email || null,
  user_photo: user?.photo || null,
  user_role: user?.role || null,
  user_phone: user?.phone || null,
  user_city: user?.city || null,
  user_country: user?.country || null,
};
