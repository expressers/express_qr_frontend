import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authService } from "@/service/api";
import { useLoadingPage } from "./use_loadingPage";

function useSigninGoogle() {
    const navigate = useNavigate()
    const { setIsVisible } = useLoadingPage();

    async function handleGoogleLogin(access_token: string) {
      try {
        const response = await authService.loginWithGoogle(access_token);

        if (!response.data.success) {
          throw new Error(`Erro ${response.status}`);
        }

        navigate("/dashboard", { replace: true });
        toast.success("Sessão iniciada com sucesso!", {
          className: "bg-green-500 text-white font-semibold",
        });
        setIsVisible(true);
      } catch (error) {
        toast.error("Erro ao iniciar a sessão com Google", {
          className: "bg-red-500/10 text-white font-semibold",
        });
        console.error("error:", error);
      }
    }

    function SiginGoogleSuccess(response: TokenResponse) {
      handleGoogleLogin(response.access_token);
    }

    const login = useGoogleLogin({
      onSuccess: SiginGoogleSuccess,
      onError: () => console.log("Erro no login com Google"),
    });
    return {
      login,
    };
}

export { useSigninGoogle };
