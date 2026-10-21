import { createContext } from "react";
import { Translations } from "@/translations";

export type langType = "pt" | "en";
export type TranslationsType = (typeof Translations)["pt"];

export type LangProvidersState = {
  valueLang: string;
  setValueLang: React.Dispatch<React.SetStateAction<langType>>;
  translations: TranslationsType;
};

const initialState: LangProvidersState = {
  valueLang: "en",
  setValueLang: () => null,
  translations: Translations["en"],
};

export const LangContext = createContext<LangProvidersState>(initialState);

