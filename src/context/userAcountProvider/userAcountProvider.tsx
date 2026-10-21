import React, { useReducer } from "react";
import { UserContext } from "./userAcountContext";
import { InitialState, userReducer } from "../reducer";




interface UserProviderProps{
    children: React.ReactNode
}

function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, InitialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};


export {UserProvider}