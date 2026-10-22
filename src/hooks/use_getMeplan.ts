import { useCallback, useEffect, useState } from "react";
import { plansManagementService, type MyPlan } from "@/service/api";

/** Plano atual, uso por tipo e subscrição (GET /api/plans/my-plan). */
function useGetMeplan() {
  const [data, setData] = useState<MyPlan>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const getMyPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setData(await plansManagementService.getMyPlan());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getMyPlan();
  }, [getMyPlan]);

  return { data, isLoading, error, refetch: getMyPlan };
}

export { useGetMeplan };
