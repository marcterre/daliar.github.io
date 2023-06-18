import "./Form.styles.scss";
import { Input } from "../Inputs/Input";
import { Button } from "../Inputs/Button";
import { ReactElement } from "react";

type FormProps = {
  className?: string;
  handleClick?: () => void;
  buttonChildren?: ReactElement;
  inputLables?: {
    label?: string;
    labelId?: string;
    placeholder?: string;
    defaultValue?: string;
    type?: string;
    handleChange?: () => void;
  }[];
};

export const Form = (props: FormProps) => {
  const { className, handleClick, inputLables, buttonChildren } = props;

  return (
    <form className={className}>
      {inputLables?.map((inputLabel, index) => (
        <Input
          key={index}
          label={inputLabel.label}
          labelId={inputLabel.labelId}
          handleChange={inputLabel.handleChange}
          placeholder={inputLabel.placeholder}
          defaultValue={inputLabel.defaultValue}
          type={inputLabel.type}
        />
      ))}
      <div className="submit-wrapper">
        <Button handleClick={handleClick} label="cancel" variant="hover" />
        <Button variant="hover " handleClick={handleClick} label="save" />
        {buttonChildren}
      </div>
    </form>
  );
};

export default Form;
