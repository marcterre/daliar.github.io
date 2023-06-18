import { Form } from "../../../../components";
import UploadWidget from "../../../../components/UploadWidget/UploadWidget";

export const HomePageViewForm = () => {
  const inputLabels = [
    { label: "Name", labelId: "name", palceholder: "Name", type: "text" },
    {
      label: "Comment",
      labelId: "comment",
      palceholder: "Comment",
      type: "text",
    },
  ];
  return (
    <div className="home-page-view-form">
      <Form inputLables={inputLabels} buttonChildren={<UploadWidget />} />
    </div>
  );
};

export default HomePageViewForm;
