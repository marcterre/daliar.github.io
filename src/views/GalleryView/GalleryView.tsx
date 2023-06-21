import images from "../../utils/db.json";
import useContent from "../../hooks/useContent";

export const GalleryView = () => {
  const [showContent, handleToggleContent] = useContent(images);

  return (
    <div className="galleryWrapper" id="gallery">
      {images.map((image, index) => (
        <div className="image-wrapper" key={index}>
          {showContent ? (
            <></>
          ) : (
            <div className="overlay">
              <article>{image.comment}</article>
              <p>{image.date}</p>
            </div>
          )}
          <figure>
            <img
              src={image.url}
              alt="something"
              key={index}
              onMouseEnter={() => handleToggleContent}
            />
          </figure>
        </div>
      ))}
    </div>
  );
};

export default GalleryView