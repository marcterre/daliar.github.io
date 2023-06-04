import images from "../../utils/db.json";
import "./Gallery.scss";

export const GalleryView = () => {
  return (
    <div className="galleryWrapper" id="gallery">
      {images.map((image, index) => (
        <div className="image-wrapper">
          <img src={image.url} alt="something" key={index} />
          <div className="overlay">
            <article>{image.comment}</article>
            <p>{image.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
