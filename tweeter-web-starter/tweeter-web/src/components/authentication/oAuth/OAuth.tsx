import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useMessageActions } from "../../toaster/MessageHooks";

interface Props {
  id: string;
  name: string;
  icon: IconProp | any;
}

const OAuth = ({ id, name, icon }: Props) => {
  const { displayInfoMessage } = useMessageActions();

  const displayInfoMessageWithDarkBackground = (message: string): void => {
    displayInfoMessage(message, 3000, "text-white bg-primary");
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
