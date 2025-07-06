"use client";
import { FunctionComponent, useEffect, useState } from "react";
import GiphyGrid from "./GiphyGrid";
import OwnItemsGrid from "./OwnItemsGrid";

type ItemModalProps = {
  toggleModal: () => void;
};

const ItemModal: FunctionComponent<ItemModalProps> = ({ toggleModal }) => {
  const [sticker, setSticker] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openTab, setOpenTab] = useState<"own" | "giphy">("giphy");

  useEffect(() => {
    const fetchSticker = async () => {
      try {
        const response = await fetch("/api/stickers");
        if (response) {
          const data = await response.json();
          setSticker(data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch stickers");
        setIsLoading(false);
      }
    };
    fetchSticker();
  }, []);

  return (
    <>
      <div className="h-[408px] absolute bottom-28 left-3 bg-black text-white border-2 border-white shadow-lg transition-transform transform translate-x-0 w-auto  z-50">
        <div className="p-2 relative w-fit">
          <button onClick={toggleModal} className="absolute top-2 right-2">
            X
          </button>
          <div className="flex justify-evenly mb-2">
            <button
              className={`p-1 ${
                openTab === "giphy" ? "bg-pink-500 underline" : ""
              } hover:bg-pink-500 active:bg-pink-500`}
              onClick={() => setOpenTab("giphy")}
            >
              Giphy
            </button>
            <button
              className={`p-1 ${
                openTab === "own" ? "bg-pink-500 underline" : ""
              } hover:bg-pink-500 active:bg-pink-500`}
              onClick={() => setOpenTab("own")}
            >
              Own Items
            </button>
          </div>
          {openTab === "giphy" ? (
            <GiphyGrid />
          ) : (
            <OwnItemsGrid items={sticker} isLoading={isLoading} error={error} />
          )}
        </div>
      </div>
    </>
  );
};

export default ItemModal;
