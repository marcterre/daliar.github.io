import { useState } from "react";
import { ButtonExpander } from "../../../../components/Inputs/Button/ButtonExpander";
import { HomePageViewForm } from "../HomePageViewForm";

export const HomePageViewExpander = () => {
  const [openExpander, setOpenExpander] = useState(false);
  return (
    <>
      <ButtonExpander
        openExpander={openExpander}
        handleExpander={() => setOpenExpander(!openExpander)}
      />
      {openExpander && <HomePageViewForm />}
    </>
  );
};

export default HomePageViewExpander;
