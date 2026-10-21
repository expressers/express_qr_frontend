import { useContext } from "react";
import { LoadingPageContext } from "@/context";

function useLoadingPage() {
  const context = useContext(LoadingPageContext);

  if (context === undefined) {
    throw new Error("useLoadingPage must be used within a Loading PageProvider");
  }

  return context;
}

export { useLoadingPage };
