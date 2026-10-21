import React, { createContext } from "react";

export type Accountype = "free" | "pro";


export type AccountypeProviderState = {
  valueAccountype: Accountype;
  setValueAccountype: React.Dispatch<React.SetStateAction<Accountype>>;
};

const initialState: AccountypeProviderState = {
  valueAccountype: "free",
  setValueAccountype: () => null,
};

export const AccountypeContext = createContext<AccountypeProviderState>(initialState); 