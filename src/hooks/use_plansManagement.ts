import { useCallback, useEffect, useState } from "react";
import { plansManagementService, type Plan } from "@/service/api";

/** Planos públicos (GET /api/plans): Free, Pro e Premium, sem preços. */
function usePlanManagement() {
  const [data, setData] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const getPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setData(await plansManagementService.getPlans());
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getPlans();
  }, [getPlans]);

  return { data, isLoading, error, refetch: getPlans };
}

export { usePlanManagement };
