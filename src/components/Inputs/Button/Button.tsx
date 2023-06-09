import { ReactElement } from "react";
import "./Button.styles.scss";

type ButtonTypes = {
  label?: string | ReactElement;
  type?: "button" | "submit" | "reset";
  handleClick?: () => void;
  variant?: string;
};

export const Button = (props: ButtonTypes) => {
  const { type, label, handleClick, variant } = props;
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`button ${variant ? `button--${variant}` : ""}`}
    >
      {label}
    </button>
  );
};
