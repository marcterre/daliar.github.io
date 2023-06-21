import { ReactElement } from "react";
import "./Button.styles.scss";
import { FormEvent } from "react";

type ButtonTypes = {
  label?: string | ReactElement;
  type?: "button" | "submit" | "reset";
  handleClick?: (e: FormEvent) => void;
  variant?: string;
};

export const Button = (props: ButtonTypes) => {
  const { type, label, handleClick, variant } = props;
  return (
    <div
      className={`button-wrapper ${
        variant ? `button-wrapper--${variant}` : ""
      }`}
    >
      <button
        type={type}
        onClick={handleClick}
        className={`button ${variant ? `button--${variant}` : ""}`}
      >
        {label}
      </button>
    </div>
  );
};
