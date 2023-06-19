import React from "react";
import {
  AdvancedImage,
  lazyload,
  responsive,
  placeholder,
} from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

const CloudinaryImage = () => {
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
      apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
      apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
    },
  });
  const image = cloudinary.image;

  return (
    <div>
      <div style={{ height: "1000px" }} />
      {/* <AdvancedImage
        cldImg={image}
        plugins={[lazyload(), responsive({ steps: [100] }), placeholder()]}
      /> */}
    </div>
  );
};

export default CloudinaryImage;
