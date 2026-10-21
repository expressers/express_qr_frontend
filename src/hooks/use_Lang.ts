import { useContext } from "react";
import { LangContext } from "@/context";

function useLang() {
  const context = useContext(LangContext);

  if (context === undefined) {
    throw new Error(
      "useLang must be used within a LangProvider",
    );
  }

  return context;
};


export { useLang };