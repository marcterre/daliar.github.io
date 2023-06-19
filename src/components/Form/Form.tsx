import "./Form.styles.scss";
import { Input } from "../Inputs/Input";
import { Button } from "../Inputs/Button";
import { ReactElement, ChangeEvent } from "react";

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
    handleChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  }[];
  handleSubmit?: (e: React.FormEvent) => void;
};

export const Form = (props: FormProps) => {
  const { className, handleClick, inputLables, buttonChildren, handleSubmit } =
    props;

  return (
    <form className={className} onSubmit={handleSubmit}>
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
        <Button variant="hover " type="submit" label="save" />
        {buttonChildren}
      </div>
    </form>
  );
};

export default Form;
