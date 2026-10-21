import React,{ createContext } from "react";

export type ModalDialogState = {
  isVisibleDialogCreate: boolean;
  isVisibleDialogSaveImg: boolean;
  setVisibleDialogCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisibleDialogSaveImg: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialState: ModalDialogState = {
  isVisibleDialogCreate: false,
  isVisibleDialogSaveImg: false,
  setVisibleDialogCreate: () => null,
  setIsVisibleDialogSaveImg: () => null,
};

export const ModalDialogContext = createContext<ModalDialogState>(initialState); 