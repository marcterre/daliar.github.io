import { Modal } from "../../../components/Layout/Modal/Modal";
import useImageStore from "../../../stores/useImageStore";

export const ImageModal = () => {
	const { images } = useImageStore();
	return (
		<Modal>
			{images.map((image, index) => (
				<div className="modal-content" key={index}>
					{/* <span className="close" onClick={() => setOpenModal(false)}>
            &times;
          </span> */}
					<img className="image-content" src={image.url} alt="something" key={index} />
					<div className="image-details">
						<h1>{image.date}</h1>
						<p>{image.comment}</p>
					</div>
				</div>
			))}
		</Modal>
	);
};
