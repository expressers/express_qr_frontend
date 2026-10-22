import { useCallback, useEffect, useState } from "react";
import { userService, type UserMe } from "@/service/api";
import { CACHE } from "@/utils";
import { useUserAccount } from "./userAccount";

const CACHE_KEY = "user_me";
const CACHE_TTL = 2 * 60 * 60 * 1000;

export function useUserGetMe() {
  const [data, setData] = useState<UserMe | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useUserAccount();

  const syncUser = useCallback(
    (userData: UserMe) => {
      dispatch({
        type: "UPDATE",
        payload: {
          user_id: userData.id,
          user_email: userData.email ?? null,
          user_name: `${userData.firstName ?? ""} ${userData.lastName ?? ""}`.trim() || null,
          user_phone: userData.phone ?? null,
          user_role: userData.role ?? null,
        },
      });
    },
    [dispatch],
  );

  const fetchUserMe = useCallback(
    async (force = false) => {
      if (!force) {
        const cached = CACHE.get<UserMe>(CACHE_KEY, CACHE_TTL);
        if (cached) {
          setData(cached);
          syncUser(cached);
          return;
        }
      }

      try {
        setIsLoading(true);
        const user = await userService.getUserMe();
        setData(user);
        CACHE.set(CACHE_KEY, user);
        syncUser(user);
      } catch {
        // 401 já é tratado no apiClient; outros erros deixam os dados em cache.
      } finally {
        setIsLoading(false);
      }
    },
    [syncUser],
  );

  useEffect(() => {
    fetchUserMe();
  }, [fetchUserMe]);

  return { data, isLoading, refreshGetMe: () => fetchUserMe(true) };
}
