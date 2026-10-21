import React, { useState } from "react";
import { LoadingPageContext } from "./loadingPageContext";

interface LoadingPageProviderProps {
  children: React.ReactNode;
}

function LoadingPageProvider({ children }: LoadingPageProviderProps) {
  const [visibleLoadingPage, setVisibleLoadingPage] = useState(false);
   const [isVisible, setIsVisible] = useState(false);

  const value = {
    visibleLoadingPage,
    isVisible,
    setVisibleLoadingPage,
    setIsVisible,
  };

  return (
    <LoadingPageContext.Provider value={value}>
      {children}
    </LoadingPageContext.Provider>
  );
}

export { LoadingPageProvider };
