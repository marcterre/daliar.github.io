import data from "../../utils/db.json";
import "./Gallery.scss";

export const GalleryView = () => {
  return (
    <div className="galleryWrapper" id="gallery">
      {data.map((dat, index) => (
        <img src={dat.url} alt="something" key={index} />
      ))}
    </div>
  );
};
