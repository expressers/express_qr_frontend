import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { userService } from "@/service/api";
import { getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";
import { useUserAccount } from "./userAccount";

function useDeleteAccount() {
  const { translations } = useLang();
  const t = translations.layout.ProfileLayout.messages;
  const { dispatch } = useUserAccount();
  const navigate = useNavigate();

  async function DeleteAccount() {
    try {
      await userService.deleteAccount();
      dispatch({ type: "LOGOUT" });
      toast.success(t.deleteSuccess);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.deleteError));
    }
  }

  return { DeleteAccount };
}

export { useDeleteAccount };
