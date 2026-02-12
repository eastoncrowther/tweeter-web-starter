import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import React, { useMemo } from "react";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { Buffer } from "buffer";
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
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
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
    return new RegisterPresenter(listener);
  }, [listener]);

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleImageFile(file);
  };

  const handleImageFile = (file: File | undefined) => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = getFileExtension(file);
      if (fileExtension) {
        setImageFileExtension(fileExtension);
      }
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
    }
  };

  const getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  const doRegister = async () => {
    await presenter.doRegister(
      firstName,
      lastName,
      alias,
      password,
      imageBytes,
      imageFileExtension,
      rememberMe,
    );
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
              if (event.key == "Enter" && !checkSubmitButtonStatus()) {
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
        Algready registered? <Link to="/login">Sign in</Link>
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
