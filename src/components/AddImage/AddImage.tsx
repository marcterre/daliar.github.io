import "./AddImage.styles.scss";
import { Button, Form } from "../Inputs";
import { useState } from "react";
import AddCircle from "../../asset/add-circle.svg";

export const AddImage = () => {
  const addCircle = <img src={AddCircle} alt="add" />;

  const [openAddImage, setOpenAddImage] = useState(false);
  return (
    <div className="AddImage-wrapper">
      <Button
        type="button"
        handleClick={() => {
          setOpenAddImage(!openAddImage);
        }}
        label={addCircle}
        variant={`add-image ${openAddImage && "rotate-45deg"}`}
      />
      <Form
        className={openAddImage ? "form-animation open" : "form-animation"}
      />
    </div>
  );
};
