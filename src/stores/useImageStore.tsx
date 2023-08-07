import create from "zustand";

export type ImageTypes = {
	id: string | number;
	url?: string;
	date?: string;
	comment?: string;
};

type ImageStoreTypes = {
	images: ImageTypes[];
	setImages: (images: ImageTypes[]) => void;
};

export const useImageStore = create<ImageStoreTypes>((set) => ({
	images: [],
	setImages: (images) => set({ images }),
}));

export default useImageStore;
