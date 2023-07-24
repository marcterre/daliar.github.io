import "./Form.styles.scss";
import { Input } from "./Input";
import { Button } from "../Button";

type FormProps = { className?: string };

export const Form = (props: FormProps) => {
  const { className } = props;
  return (
    <form className={`dynamic-form ${className}`}>
      <Input label="Name" />
      <Input label="Comment" />
      <Button
        variant="hover "
        label="Image upload"
        handleClick={() => console.log("upload image")}
      />
      <div className="submit-wrapper">
        <Button
          handleClick={() => console.log("cancel")}
          label="cancel"
          variant="hover"
        />
        <Button
          variant="hover "
          handleClick={() => console.log("submit")}
          label="save"
        />
      </div>
    </form>
  );
};

export default Form;
