import React, { useEffect, useState } from 'react'
import { AccountypeContext } from './accountypeContext'
import type {Accountype} from "./accountypeContext"

interface AccountypeProviderProps {
  children: React.ReactNode;
}

function AccountypeProvider({ children }: AccountypeProviderProps) {
  const [valueAccountype, setValueAccountype] = useState<Accountype>(() => {
    return (localStorage.getItem("account_type") as Accountype) || "free";
  });
  useEffect(() => {
    if (valueAccountype) {
      localStorage.setItem("account_type", valueAccountype);
    }
  }, [valueAccountype]);

  const value = {
    valueAccountype,
    setValueAccountype,
  };
  return (
    <AccountypeContext.Provider value={value}>
      {children}
    </AccountypeContext.Provider>
  );
}

export {AccountypeProvider}