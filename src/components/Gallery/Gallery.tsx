export const Gallery = () => {
  const images = ["ajsnd", "asjdbjk"];
  return (
    <div className="galleryWrapper" id="gallery">
      {images.map((image, index) => (
        <p key={index}>{image}</p>
      ))}
    </div>
  );
};
