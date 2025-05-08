"use client";

import { useAuthentication } from "@/hooks/useAuthentication";

const StickerButton = () => {
  const { user } = useAuthentication();
  return (
    user && (
      <button
        onClick={() => {
          console.log("sticker button clicked");
        }}
      >
        Sticker
      </button>
    )
  );
};

export default StickerButton;
