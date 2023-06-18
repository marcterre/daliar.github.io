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
        cloudName: "demo",
        uploadPreset: "preset1",
        folder: "widgetUpload",
        cropping: true,
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
