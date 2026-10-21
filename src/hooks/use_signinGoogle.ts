import { useGoogleLogin, type TokenResponse } from "@react-oauth/google";
import { useUserAccount } from "./userAccount";
import { useNavigate } from "react-router-dom";

function useSigninGoogle() {
    const navigate = useNavigate()
    const { dispatch } = useUserAccount()
    async function handleGoogleLogin(access_token: string) {
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const userData = await res.json();

      console.log(userData);

    /*dispatch({
        type: "LOGIN",
        payload: {
          id: userData.sub,
          name: userData.name,
          email: userData.email,
          photo: userData.picture,
        },
      });

      navigate("/dashboard", { replace: true });*/
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
