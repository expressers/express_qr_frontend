import { plansManagementService, type PlanData} from "@/service/api"
import { useCallback, useEffect, useState } from "react"

function useGetMeplan() {
    const [data, setData] = useState<PlanData>()
    const [isLoding, setIsLoding] = useState(false)
    const getMePlan = useCallback(async() => {
       
        try {
            setIsLoding(true)
            const response = await plansManagementService.getPlanMe() 
            const { data } = response.data;
           
            if (response.data.success) {
                setData(data)
            }
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false);
        }
    }, [])

    useEffect(() => {
      getMePlan();
    }, [getMePlan]);
    

    return {
        data,
        isLoding
    };
}

export {useGetMeplan}