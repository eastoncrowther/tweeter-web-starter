import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ToastActionsContext } from "../../toaster/ToastContexts";
import { ToastType } from "../../toaster/Toast";

interface Props {
  id: string;
  name: string;
  icon: IconProp | any;
}

const OAuth = ({ id, name, icon }: Props) => {
  const { displayToast } = useContext(ToastActionsContext);

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayToast(
      ToastType.Info,
      message,
      3000,
      undefined,
      "text-white bg-primary",
    );
  };

  const handleOAuthClick = () => {
    displayInfoMessageWithDarkBackground(
      `${name} registration is not implemented.`,
    );
  };

  return (
    <button
      type="button"
      className="btn btn-link btn-floating mx-1"
      onClick={handleOAuthClick}
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={id}>{name}</Tooltip>}
      >
        <FontAwesomeIcon icon={icon} />
      </OverlayTrigger>
    </button>
  );
};

export default OAuth;
