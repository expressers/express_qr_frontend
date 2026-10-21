
import React, { useEffect, useState } from "react";
import { LangContext, type langType } from "./langContext";
import { Translations } from "@/translations";
interface LangProvidersProps {
  children: React.ReactNode;
}

function LangProvider({ children }: LangProvidersProps) {
  const [valueLang, setValueLang] = useState<langType>(() => {
    return (localStorage.getItem("lang") as langType) || "pt";
  });

  useEffect(() => {
    if (valueLang) {
      localStorage.setItem("lang", valueLang);
    }
  }, [valueLang]);

  const translations = Translations[valueLang];

  const value = {
    valueLang,
    setValueLang,
    translations,
  };

  return (
    <React.Fragment>
      <LangContext.Provider value={value}>{children}</LangContext.Provider>
    </React.Fragment>
  );
}

export { LangProvider };