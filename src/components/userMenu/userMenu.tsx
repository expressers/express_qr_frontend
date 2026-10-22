import React from 'react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  
} from "../ui";
import { Link } from "react-router-dom";
import { useUserAccount } from '@/hooks';
import { userNameParts } from '@/utils';


function UserMenu() {
  const { state } = useUserAccount()
 
      
      const initials =  userNameParts(state.user_name);;
  return (
    <React.Fragment>
      <Link to="/dashboard">
        <Avatar className="md:w-12 md:h-12 border-2 border-green-500">
          <AvatarImage
            src={state.user_photo ? state.user_photo : ""}
            alt={state.user_name ? state.user_name : "ExpressQR"}
          />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Link>
    </React.Fragment>
  );
}

export {UserMenu}