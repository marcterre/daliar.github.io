import React, { useState } from "react";
import images from "../../utils/db.json";
import "./GalleryView.styles.scss";

export const GalleryView: React.FC = () => {
  const [showOverlay, setShowOverlay] = useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    setShowOverlay(index);
  };

  const handleMouseLeave = () => {
    setShowOverlay(null);
  };

  return (
    <div className="galleryWrapper" id="gallery">
      {images.map((image, index) => (
        <div
          className={`image-wrapper ${showOverlay === index ? "hovered" : ""}`}
          key={index}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overlay">
            <article>{image.comment}</article>
            <p>{image.date}</p>
          </div>
          <img src={image.url} alt="something" />
        </div>
      ))}
    </div>
  );
};
