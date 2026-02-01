import React from "react";

interface Props {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  isLoading?: boolean;

  classNameInput?: string;
  classNameContainer?: string;

  action: () => Promise<void>;
  checkSubmitButtonStatus: () => boolean;
}

const AuthenticationFields = (props: Props) => {
  const actionOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !props.checkSubmitButtonStatus()) {
      props.action();
    }
  };

  return (
    <div className={`form-floating ${props.classNameContainer ?? ""}`}>
      <input
        type={props.type ?? "text"}
        className={`form-control ${props.classNameInput ?? ""}`}
        id={props.id}
        placeholder={props.placeholder ?? props.label}
        onKeyDown={actionOnEnter}
        onChange={(event) => props.onChange(event.target.value)}
        disabled={props.isLoading}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </div>
  );
};

export default AuthenticationFields;
