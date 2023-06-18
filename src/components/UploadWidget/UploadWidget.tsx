import { useEffect, useState } from "react";

const UploadWidget = () => {
  const [myCropWidget, setMyCropWidget] = useState<any>(null);

  const handleWidget = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    myCropWidget.open();
  };

  useEffect(() => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_PRESET,
        folder: "daliar_website_uploads",
        cropping: false,
      },
      (error: any, result: any) => {
        console.log(error, result);
      }
    );

    setMyCropWidget(widget);

    return () => {
      widget.close();
    };
  }, []);

  return (
    <div>
      <button
        id="upload-widget"
        className="cloudinary-button"
        onClick={handleWidget}
      >
        Upload Files
      </button>
    </div>
  );
};

export default UploadWidget;
