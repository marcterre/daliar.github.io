import React from "react";
import { HexColorPicker } from "react-colorful";
import Button from "../Button";
import InputWithCopy from "../InputWithCopy";

interface ColorPickerProps {
  currentColor: string;
  handleColorChange: (color: string) => void;
  setIsColorPickerOpen: (open: boolean) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  currentColor,
  handleColorChange,
  setIsColorPickerOpen,
}) => {
  return (
    <div className="w-fit mt-1 p-3 bg-black border border-white rounded-sm shadow-lg z-50">
      <HexColorPicker color={currentColor} onChange={handleColorChange} />
      <div className="mt-2 flex items-center justify-between w-full">
        <InputWithCopy value={currentColor} onChange={handleColorChange} />
        <Button
          text="Done"
          handleClick={() => setIsColorPickerOpen(false)}
          type="black"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
