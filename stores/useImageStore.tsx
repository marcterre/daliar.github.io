import create from "zustand";

export type ImageTypes = {
  id: string;
  url: string;
  date: string;
  comment: string;
};

type ImageStoreTypes = {
  images: ImageTypes[];
  setImages: (images: ImageTypes[]) => void;
};

export const useImageStore = create(
  (set): ImageStoreTypes => ({
    images: [],
    setImages: (images) => set({ images }),
  })
);

export default useImageStore;
