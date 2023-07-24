import images from "../../utils/db.json";
import "./GalleryView.styles.scss";
import { Button } from "../../components/Inputs";
import { useEffect, useState } from "react";
import { ImageModal } from "./partials/ImageModal";

export const GalleryView = () => {
  const { setImages } = useImageStore();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setImages(images);
  }, [setImages]);

  return (
    <div className="gallery-wrapper" id="gallery">
      {images.map((image, index) => (
        <div className="image-wrapper" key={index}>
          <img
            className="image-content"
            src={image.url}
            alt="something"
            key={index}
          />
          <Button
            variant="image-expand"
            handleClick={() => setOpenModal(true)}
            label="View Details"
          />
          {openModal && <ImageModal />}
        </div>
      ))}
    </div>
  );
};

export default GalleryView;
function useImageStore(): { images: any; setImages: any } {
  throw new Error("Function not implemented.");
}
