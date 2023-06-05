import { ChangeEvent } from "react";
import "./Input.styles.scss";

type InputProps = {
  labelId?: string;
  label?: string;
  variant?: string;
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Input = (props: InputProps) => {
  const {
    labelId,
    variant,
    label,
    type,
    defaultValue,
    placeholder,
    handleChange,
  } = props;

  return (
    <>
      <label
        htmlFor={labelId}
        className={`label ${variant ? `label--${variant}` : ""}`}
      >
        {label && label}
      </label>
      <input
        defaultValue={defaultValue}
        type={type}
        id={labelId}
        className={`text-input ${variant ? `text-input--${variant}` : ""}`}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </>
  );
};

export default Input;
