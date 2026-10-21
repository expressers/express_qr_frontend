import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function isTokenValid(): boolean {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("auth_token");

  if (!token) return false;

  try {
    const expStr = localStorage.getItem("auth_token_exp");

    
    if (expStr) {
      const expMs = Number(expStr);

      if (Number.isNaN(expMs)) return false;

      return Date.now() < expMs;
    }

   
    const decoded: { exp?: number } = jwtDecode(token);

    if (!decoded.exp) return false;

    return Date.now() < decoded.exp * 1000;
  } catch {
    return false;
  }
}

function ProtectedRoutes() {
  const valid = isTokenValid();

  if (!valid) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <Outlet />;
}

export { ProtectedRoutes };