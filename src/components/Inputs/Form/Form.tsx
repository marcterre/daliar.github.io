import React from "react";
import "./Form.styles.scss";
import { Input } from "./Input";
import { Button } from "../Button";

type FormProps = {};

export const Form = (props: FormProps) => {
  const {} = props;
  return (
    <form>
      <Input label="Name" />
      <Input label="Comment" />
      <Button
        label="Image upload"
        handleClick={() => console.log("upload image")}
      />
      <Button handleClick={() => console.log("cancel")} label="cancel" />
      <Button handleClick={() => console.log("submit")} label="save" />
    </form>
  );
};

export default Form;
