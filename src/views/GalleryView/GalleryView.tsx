import images from "../../utils/db.json";
import "./GalleryView.styles.scss";
import { useEffect } from "react";
import useImageStore from "../../stores/useImageStore";

export const GalleryView = () => {
	const { setImages } = useImageStore();

	useEffect(() => {
		setImages(images);
	}, [setImages]);

	return (
		<div className="gallery-wrapper" id="gallery">
			{images.map((image, index) => {
				const { url, comment, date } = image;
				return (
					<div
						className={`image-wrapper ${comment ? "image-wrapper-hover" : ""}`}
						key={index}
					>
						<img className="image-content" src={url} alt="something" key={index} />
						{comment && (
							<div className="image-wrapper-middle">
								<p>{comment}</p>
								<p>{date}</p>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default GalleryView;
