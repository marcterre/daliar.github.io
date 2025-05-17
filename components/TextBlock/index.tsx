"use client";
import { useEffect, useState } from "react";
import FontDropdown from "@/components/TextBlock/FontDropdown.tsx";
import DraggableItemsWrapper from "../DraggableItemsWrapper";
import { useItemsPositions } from "@/stores/ItemsPositionsProvider";
import { elementToString } from "@/utils/elementToString";
import { useItems } from "@/stores/ItemsProvider";

export const createTextBlockJson = (text: string) => {
  return {
    type: "TextBlock",
    props: {
      text,
    },
  };
};

const TextBlock = () => {
  const id = Math.random().toString(36).substring(2, 15);
  const [text, setText] = useState<string>("");
  const { setIsTextBlockOpen } = useItems();
  const { addNewItem, positions, setIsSaved } = useItemsPositions();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSave = () => {
    setIsSaved(true);
    setIsTextBlockOpen(false);
    const element = document.getElementById(id);
    const removeHiddenClass = () => element?.classList.remove("hidden");
    removeHiddenClass();
    const elementString = elementToString(element as HTMLElement);
    addNewItem(elementString, positions.x, positions.y);
  };

  return (
    <>
      <DraggableItemsWrapper showDragIcon>
        <div className="group absolute grid group-hover:bg-slate-100 h-[92px] group-hover:text-black shadow-lg transition-transform transform translate-x-0 border border-gray-300 w-auto z-50">
          <div className="flex">
            <FontDropdown />
            <button onClick={() => setIsTextBlockOpen(false)}>x</button>
          </div>
          <input
            value={text}
            onChange={(e) => handleChange(e)}
            type="text"
            className="group-hover:bg-white bg-inherit border self-end border-gray-400 group-hover:text-black rounded p-2 w-full"
            placeholder="Enter text here..."
          />
          <p
            id={id}
            style={{
              position: "absolute",
              top: positions.y,
              left: positions.x,
            }}
            className="hidden text-white"
          >
            {text}
          </p>
        </div>
      </DraggableItemsWrapper>
      <button className="z-50" onClick={handleSave}>
        save
      </button>
    </>
  );
};

export default TextBlock;
