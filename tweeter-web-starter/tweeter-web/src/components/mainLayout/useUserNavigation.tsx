import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenter/UserNavigationPresenter";

const useUserNavigation = () => {
  const { displayErrorMessage } = useMessageActions();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser, authToken } = useUserInfo();
  const navigate = useNavigate();

  const listener: UserNavigationView = useMemo(() => {
    return {
      setDisplayedUser: setDisplayedUser,
      navigateTo: navigate,
      displayErrorMessage: displayErrorMessage,
    };
  }, [setDisplayedUser, navigate, displayErrorMessage]);

  const presenter = useMemo(() => {
    return new UserNavigationPresenter(listener);
  }, [listener]);

  const navigateToUser = async (
    event: React.MouseEvent,
    pathPrefix: string,
  ): Promise<void> => {
    event.preventDefault();
    await presenter.navigateToUser(
      authToken!,
      displayedUser,
      event.target.toString(),
      pathPrefix,
    );
  };

  return { navigateToUser };
};

export default useUserNavigation;
