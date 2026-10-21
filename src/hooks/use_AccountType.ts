import { useContext } from "react";
import { AccountypeContext } from "@/context";

function useAccountype() {
  const context = useContext(AccountypeContext);

  if (context === undefined) {
    throw new Error(
      "useAccountype must be used within a AccountypeProvider",
    );
  }

  return context;
};


export { useAccountype }; 