import React,{ createContext } from "react";

export type LoadingState = {
  visibleLoadingPage: boolean;
  isVisible: boolean;
  setVisibleLoadingPage: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialState: LoadingState = {
  visibleLoadingPage: false,
  isVisible: false,
  setVisibleLoadingPage: () => null,
  setIsVisible: () => null,
};

export const LoadingPageContext = createContext<LoadingState>(initialState); 