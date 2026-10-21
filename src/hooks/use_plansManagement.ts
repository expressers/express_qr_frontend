import { plansManagementService, type PlanInfo } from "@/service/api";
import { useCallback, useEffect, useState } from "react";

function usePlanManagement() {
  const [data, setData] = useState<PlanInfo[]>([]);


  const getPlan = useCallback(async() => {
     try {
       const response = await plansManagementService.getPlans();
       const { data, success } = response.data;
       
       
       if (success) {
         setData(data.plans);
       }
     } catch (error) {
       console.log(error);
     }
  },[])
 
  useEffect(() => {
    getPlan();
  }, [getPlan]);
    
    return {
      data,
      setData,
    };
}


export { usePlanManagement };
