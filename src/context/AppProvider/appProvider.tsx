import React from "react";
import { ThemeProvider } from "../theme";
import { AccountypeProvider } from "../accountTypeProvider";
import { UserProvider } from "../userAcountProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LangProvider } from "../langProvider";
import { LoadingPageProvider } from "../loadingPageProvider";
import  {ModalDialogProvider} from "../modalDialogProvider"
import { config } from "../../config";
interface AppProviderProps {
  children: React.ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  const clientId = config.googleClientId;
  return (
    <React.Fragment>
      <ThemeProvider storageKey="vite-ui-theme">
        <GoogleOAuthProvider clientId={clientId}>
          <UserProvider>
            <ModalDialogProvider>

            <LoadingPageProvider>
              <LangProvider>
                <AccountypeProvider>{children}</AccountypeProvider>
              </LangProvider>
            </LoadingPageProvider>
            </ModalDialogProvider>
          </UserProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </React.Fragment>
  );
}

export { AppProvider };
