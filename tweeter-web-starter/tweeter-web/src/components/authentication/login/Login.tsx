import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, FakeData, User } from "tweeter-shared";
import AuthenticationFields from "../authenticationFields/AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { AuthView } from "../../../presenter/AuthPresenter";
import { LoginPresenter } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const listener: AuthView = {
    setIsLoading: setIsLoading,
    displayErrorMessage: displayErrorMessage,
    navigate: navigate,
    updateUserInfo: updateUserInfo,
  };

  const presenter = useMemo(() => {
    return new LoginPresenter(listener);
  }, [listener]);

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const doLogin = async () => {
    await presenter.doLogin(alias, password, rememberMe, props.originalUrl);
  };

  const login = async (
    alias: string,
    password: string,
  ): Promise<[User, AuthToken]> => {
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          id="aliasInput"
          label="Alias"
          type="text"
          placeholder="name@example.com"
          onChange={setAlias}
          isLoading={isLoading}
          action={doLogin}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
        />

        <AuthenticationFields
          id="passwordInput"
          label="Password"
          type="password"
          onChange={setPassword}
          isLoading={isLoading}
          action={doLogin}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
          classNameInput="bottom"
          classNameContainer="mb-3"
        />
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
