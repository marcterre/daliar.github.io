import { Button, Form } from "../..";
import { useState } from "react";
import AddCircle from "../../../../asset/add-circle.svg";

export const AddImageButton = () => {
  const addCircle = <img className="button-label" src={AddCircle} alt="add" />;

  const [openAddImage, setOpenAddImage] = useState(false);
  return (
    <>
      <Button
        type="button"
        handleClick={() => {
          setOpenAddImage(!openAddImage);
        }}
        label={addCircle}
        variant={`add-image `}
      />
      <Form
        className={openAddImage ? "form-animation open" : "form-animation"}
      />
    </>
  );
};

export default AddImageButton;
