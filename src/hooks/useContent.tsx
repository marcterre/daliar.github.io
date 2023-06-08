import { useEffect, useState } from "react";

type ContentType = {
  images?: { url: string; comment: string; date: string }[];
  length: number;
};

export const useContent = (images: ContentType) => {
  const [showContent, setShowContent] = useState(
    Array(images.length).fill(false)
  );

  useEffect(() => {
    setShowContent((prevShowContent) => {
      const newShowContent = [...prevShowContent];
      newShowContent.fill(!showContent[0], 0, images.length);
      return newShowContent;
    });
  }, [showContent, images]);

  const handleToggleContent = (index: number) => {
    setShowContent((prevShowContent) => {
      const newShowContent = [...prevShowContent];
      newShowContent[index] = !prevShowContent[index];
      return newShowContent;
    });
  };

  return [showContent, handleToggleContent];
};

export default useContent;
