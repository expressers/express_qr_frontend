import { useContext } from "react";
import { ModalDialogContext } from "@/context";

function useModalDialog() {
  const context = useContext(ModalDialogContext);

  if (context === undefined) {
    throw new Error(
      "useLoadingPage must be used within a Loading PageProvider",
    );
  }

  return context;
}

export { useModalDialog };
