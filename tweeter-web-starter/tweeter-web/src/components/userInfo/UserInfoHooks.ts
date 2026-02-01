import { useContext } from "react";
import {
  UserInfoActions,
  UserInfoActionsContext,
  UserInfoContext,
} from "./UserInfoContexts";
import { UserInfo } from "./UserInfo";

// Hook to access the current UserInfo state (currentUser, displayedUser, authToken).
export const useUserInfo = (): UserInfo => {
  return useContext(UserInfoContext);
};

// Hook to access UserInfo actions (update, clear, setDisplayed).
export const useUserInfoActions = (): UserInfoActions => {
  return useContext(UserInfoActionsContext);
};
