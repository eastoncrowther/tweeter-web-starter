import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import React, { useRef } from "react";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../authenticationFields/AuthenticationFields";
import { useMessageActions } from "../../toaster/MessageHooks";
import { useUserInfoActions } from "../../userInfo/UserInfoHooks";
import { AuthView } from "../../../presenter/AuthPresenter";
import { RegisterPresenter } from "../../../presenter/RegisterPresenter";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string>("");
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

  const presenterRef = useRef<RegisterPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new RegisterPresenter(listener);
  }

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName || !lastName || !alias || !password || !imageUrl || !imageFile
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageFile(file);
    setImageUrl(file ? URL.createObjectURL(file) : "");
  };

  const doRegister = async () => {
    if (imageFile) {
      await presenterRef.current!.doRegister(
        firstName,
        lastName,
        alias,
        password,
        imageFile,
        rememberMe,
      );
    }
  };

  const inputFieldFactory = () => {
    return (
      <>
        <AuthenticationFields
          id="firstNameInput"
          label="First Name"
          placeholder="First Name"
          onChange={setFirstName}
          isLoading={isLoading}
          action={doRegister}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
        />

        <AuthenticationFields
          id="lastNameInput"
          label="Last Name"
          placeholder="Last Name"
          onChange={setLastName}
          isLoading={isLoading}
          action={doRegister}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
        />

        <AuthenticationFields
          id="aliasInput"
          label="Alias"
          placeholder="name@example.com"
          onChange={setAlias}
          isLoading={isLoading}
          action={doRegister}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
        />

        <AuthenticationFields
          id="passwordInput"
          label="Password"
          type="password"
          placeholder="Password"
          onChange={setPassword}
          isLoading={isLoading}
          action={doRegister}
          checkSubmitButtonStatus={checkSubmitButtonStatus}
        />
        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={(event: React.KeyboardEvent<HTMLElement>) => {
              if (event.key === "Enter" && !checkSubmitButtonStatus()) {
                doRegister();
              }
            }}
            onChange={handleFileChange}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail" alt=""></img>
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;
