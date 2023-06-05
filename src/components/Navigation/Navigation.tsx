import { Link } from "react-router-dom";
import "./Navigation.scss";
import { Button, Form } from "../Inputs";
import { useState } from "react";

export const Navigation = () => {
  const [openAddImage, setOpenAddImage] = useState(true);
  return (
    <div className="navigation-wrapper">
      <Button
        type="button"
        handleClick={() => setOpenAddImage(!openAddImage)}
        label="add new image"
      />
      {openAddImage && <Form />}
    </div>
  );
};
