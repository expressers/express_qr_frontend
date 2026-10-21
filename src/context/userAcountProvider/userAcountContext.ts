
import React, { createContext} from "react";

import type { User, UserAction } from "../reducer";

export type UserContextType = {
  state: User;
  dispatch: React.Dispatch<UserAction>;
};

export const UserContext = createContext<UserContextType | undefined>(undefined);


