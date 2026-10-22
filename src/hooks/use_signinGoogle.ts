import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/service/api";
import { getErrorMessage } from "@/utils";
import { useLang } from "./use_Lang";
import { useLoadingPage } from "./use_loadingPage";

function useSigninGoogle() {
  const navigate = useNavigate();
  const { translations } = useLang();
  const t = translations.pages.SignIn;
  const { setIsVisible } = useLoadingPage();

  async function handleGoogleLogin(accessToken: string) {
    try {
      await authService.loginWithGoogle(accessToken);
      navigate("/dashboard", { replace: true });
      toast.success(t.toastSuccess);
      setIsVisible(true);
    } catch (error) {
      toast.error(getErrorMessage(error, translations.errors, t.toastGoogleError));
    }
  }

  function SiginGoogleSuccess(response: TokenResponse) {
    handleGoogleLogin(response.access_token);
  }

  const login = useGoogleLogin({
    onSuccess: SiginGoogleSuccess,
    onError: () => toast.error(t.toastGoogleError),
  });

  return {
    login,
  };
}

export { useSigninGoogle };
