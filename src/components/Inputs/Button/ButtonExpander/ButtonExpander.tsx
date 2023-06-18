import "./ButtonExpander.styles.scss";
import { Button } from "../..";
import AddCircle from "../../../../asset/add-circle.svg";

type ButtonExpanderProps = {
  handleExpander?: () => void;
  openExpander?: boolean;
};

export const ButtonExpander = (props: ButtonExpanderProps) => {
  const { handleExpander, openExpander } = props;
  const addCircle = <img src={AddCircle} alt="add" />;

  return (
    <div className="button-expander-wrapper">
      <Button
        type="button"
        handleClick={handleExpander}
        label={addCircle}
        variant={`add-image ${openExpander && "rotate-45deg"}`}
      />
    </div>
  );
};

export default ButtonExpander;
