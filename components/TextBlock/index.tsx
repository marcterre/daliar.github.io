"use client";
import { useState } from "react";
import FontDropdown from "@/components/TextBlock/FontDropdown.tsx";
import { useItems } from "@/stores/ItemsProvider";
import { DraggableItem } from "../DraggableItem";

const TextBlock = () => {
  const [text, setText] = useState<string>("");
  const { selectedFont } = useItems();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <DraggableItem
      id={""}
      initialPosition={{
        x: 0,
        y: 0,
      }}
    >
      <div className="absolute bg-slate-100 text-black shadow-lg transition-transform transform translate-x-0 border border-gray-300 w-auto z-50">
        <div className="flex">
          <FontDropdown />
          <button>x</button>
        </div>
        <input
          style={{ fontFamily: selectedFont }}
          value={text}
          onChange={(e) => handleChange(e)}
          type="text"
          className="border border-gray-400 rounded p-2 w-full"
          placeholder="Enter text here..."
        />
        <div>
          <button>save</button>
        </div>
      </div>
    </DraggableItem>
  );
};

export default TextBlock;
