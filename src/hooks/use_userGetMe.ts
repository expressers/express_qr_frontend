import { useCallback, useEffect, useState } from "react";
import { userService, type GetUserMe } from "@/service/api";
import { useUserAccount } from "@/hooks"; 
import { CACHE } from "@/utils";

const CACHE_KEY = "user_me";
const CACHE_TTL = 2 * 60 * 60 * 1000;
export function useUserGetMe() {
  const [data, setData] = useState<GetUserMe["data"] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useUserAccount();
  

  const syncUser = useCallback(
    (userData: GetUserMe["data"]) => {
      const name = `${userData.firstName} ${userData.lastName}`;
      const updatedUser = {
        user_id: userData.id,
        user_email: userData.email,
        user_name: name,
        user_phone: userData.phone,
        user_role: userData.role,
      };

     
      dispatch({ type: "UPDATE", payload: updatedUser });

      
     
    },
    [dispatch],
  );

  const fetchUserMe = useCallback(
    async (force = false) => {
      if (!force) {
        const cached = CACHE.get<GetUserMe["data"]>(CACHE_KEY, CACHE_TTL);
        if (cached) {
          setData(cached);
          syncUser(cached);
          return;
        }
      }

      try {
        setIsLoading(true);
        const response = await userService.getUserMe();
        const { data } = response.data;

        if (response.data.success) {
          setData(data);
          CACHE.set(CACHE_KEY, data);
          syncUser(data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
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
