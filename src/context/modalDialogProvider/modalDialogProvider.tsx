import React, { useState } from "react";
import { ModalDialogContext } from "./modalDialogContext";

interface ModalDialogProviderProps {
  children: React.ReactNode;
}

function ModalDialogProvider({ children }: ModalDialogProviderProps) {
  const [isVisibleDialogCreate, setVisibleDialogCreate] = useState(false);
   const [isVisibleDialogSaveImg, setIsVisibleDialogSaveImg] = useState(false);

  const value = {
    isVisibleDialogCreate,
    isVisibleDialogSaveImg,
    setVisibleDialogCreate,
    setIsVisibleDialogSaveImg,
  };

  return (
    <ModalDialogContext.Provider value={value}>
      {children}
    </ModalDialogContext.Provider>
  );
}

export { ModalDialogProvider };
