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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      <div className="h-[408px] absolute bottom-36 left-28 bg-slate-100 text-black shadow-lg transition-transform transform translate-x-0 border border-gray-300 w-auto  z-50">
        <div className="p-2 relative w-fit">
          <button onClick={toggleModal} className="absolute top-2 right-2">
            X
          </button>
          <div className="flex justify-evenly mb-2">
            <button
              className={`p-1 ${
                openTab === "giphy" ? "bg-slate-300 underline" : ""
              } hover:bg-slate-200 active:bg-slate-300`}
              onClick={() => setOpenTab("giphy")}
            >
              Giphy
            </button>
            <button
              className={`p-1 ${
                openTab === "own" ? "bg-slate-300 underline" : ""
              } hover:bg-slate-200 active:bg-slate-300`}
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
