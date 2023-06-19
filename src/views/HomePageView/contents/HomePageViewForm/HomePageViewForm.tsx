import { SetStateAction, useState, ChangeEvent, FormEvent } from "react";
import { Form, Input } from "../../../../components";
import UploadWidget from "../../../../components/UploadWidget/UploadWidget";

export const HomePageViewForm = () => {
  const inputLables = [
    { label: "Name", labelId: "name", placeholder: "Name", type: "text" },
    {
      label: "Comment",
      labelId: "comment",
      placeholder: "Comment",
      type: "text",
    },
  ];
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState<
    string | ArrayBuffer | null
  >("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errMsg, setErrMsg] = useState("");

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      previewFile(file);
      setSelectedFile(file);
      setFileInputState(e.target.value);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmitFile = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    uploadImage(previewSource);
    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onerror = () => {
      console.error("AHHHHHHHH!!");
      setErrMsg("something went wrong!");
    };
  };

  const uploadImage = async (
    base64EncodedImage: string | ArrayBuffer | null
  ) => {
    console.log(base64EncodedImage);
    try {
      await fetch("api/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-type": "apllication/json" },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-page-view-form">
      <Form
        handleSubmit={handleSubmitFile}
        inputLables={inputLables}
        buttonChildren={
          <Input
            type="file"
            label="Image Upload"
            labelId="image-upload"
            handleChange={handleFileInputChange}
            value={fileInputState}
          />
        }
      />
      {previewSource && <img src={previewSource.toString()} alt="chosen" />}
    </div>
  );
};

export default HomePageViewForm;
