"use client";
import React, { useState, useEffect } from "react";
import { useItems } from "@/stores/ItemsProvider";
import { ChevronDown, Palette, Type, Layers } from "lucide-react";
import ColorPicker from "../ColorPicker";

const Toolbar: React.FC = () => {
  const {
    globalFontFamily,
    setGlobalFontFamily,
    globalFontSize,
    setGlobalFontSize,
    globalColor,
    setGlobalColor,
    globalZIndex,
    setGlobalZIndex,
    textBlocks,
    selectedTextBlockId,
    updateSelectedTextBlock,
  } = useItems();

  const [fonts, setFonts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;
  const selectedTextBlock = textBlocks.find(
    (block) => block.id === selectedTextBlockId
  );

  const currentFontFamily = selectedTextBlock?.fontFamily || globalFontFamily;
  const currentFontSize = selectedTextBlock?.fontSize || globalFontSize;
  const currentColor = selectedTextBlock?.color || globalColor;
  const currentZIndex = selectedTextBlock?.zIndex || globalZIndex;
  const currentLayer = currentZIndex - 31;

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?sort=POPULARITY&key=${API_KEY}`
        );
        const data = await response.json();
        const popularFonts = data.items.slice(0, 50);
        setFonts(popularFonts);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch fonts:", error);
        setIsLoading(false);
      }
    };

    if (API_KEY) {
      fetchFonts();
    } else {
      setFonts([
        { family: "Inter" },
        { family: "Roboto" },
        { family: "Open Sans" },
        { family: "Lato" },
        { family: "Montserrat" },
        { family: "Poppins" },
        { family: "Source Sans Pro" },
        { family: "Merriweather" },
        { family: "Playfair Display" },
        { family: "Oswald" },
      ]);
      setIsLoading(false);
    }
  }, [API_KEY]);

  const handleFontChange = (fontFamily: string) => {
    setIsFontDropdownOpen(false);
    loadGoogleFont(fontFamily);

    if (selectedTextBlock) {
      updateSelectedTextBlock({ fontFamily });
    } else {
      setGlobalFontFamily(fontFamily);
    }
  };

  const handleFontSizeChange = (size: number) => {
    if (selectedTextBlock) {
      updateSelectedTextBlock({ fontSize: size });
    } else {
      setGlobalFontSize(size);
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedTextBlock) {
      updateSelectedTextBlock({ color });
    } else {
      setGlobalColor(color);
    }
  };

  const handleZIndexChange = (zIndex: number) => {
    const clampedZIndex = Math.max(31, Math.min(50, zIndex));
    if (selectedTextBlock) {
      updateSelectedTextBlock({ zIndex: clampedZIndex });
    } else {
      setGlobalZIndex(clampedZIndex);
    }
  };

  const loadGoogleFont = (fontFamily: string) => {
    const existingLink = document.querySelector(
      `link[href*="${fontFamily.replace(" ", "+")}"]`
    );

    if (!existingLink) {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
        " ",
        "+"
      )}:wght@400;500;600;700&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  };

  useEffect(() => {
    if (currentFontFamily) {
      loadGoogleFont(currentFontFamily);
    }
  }, [currentFontFamily]);

  return (
    <div
      data-toolbar="true"
      className=" fixed top-3 left-1/2 transform -translate-x-1/2 bg-black border-2 border-gray-300 rounded-sm shadow-lg p-2 z-50 flex items-center gap-4"
    >
      <div className="relative">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-medium text-white whitespace-nowrap ">
            Font Family
          </label>
          <button
            onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-md hover:border-gray-400 transition-colors min-w-[120px] bg-white text-gray-900"
            style={{ fontFamily: currentFontFamily }}
          >
            <Type size={16} className="text-gray-600" />
            <span className="text-sm text-gray-900">{currentFontFamily}</span>
            <ChevronDown size={14} className="text-gray-600" />
          </button>
        </div>
        {isFontDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
            {isLoading ? (
              <div className="p-2 text-sm text-gray-500">Loading fonts...</div>
            ) : (
              fonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => handleFontChange(font.family)}
                  className="w-full text-left px-2 py-1 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                  style={{ fontFamily: font.family }}
                >
                  {font.family}
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="block text-xs font-medium text-white whitespace-nowrap">
          Font Size
        </label>
        <input
          type="number"
          value={currentFontSize}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value)) {
              handleFontSizeChange(value);
            }
          }}
          onBlur={(e) => {
            const value = parseInt(e.target.value);
            if (isNaN(value) || value < 8) {
              handleFontSizeChange(8);
            } else if (value > 200) {
              handleFontSizeChange(200);
            }
          }}
          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          min="8"
          max="200"
          step="1"
        />
      </div>
      <div className="relative">
        <div className="flex items-center gap-2">
          <label className="block text-xs font-medium text-white">Color</label>
          <button
            onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 transition-colors bg-white"
          >
            <Palette size={16} className="text-gray-600" />
            <div
              className="w-4 h-4 rounded border border-gray-300"
              style={{ backgroundColor: currentColor }}
            />
          </button>
        </div>
        {isColorPickerOpen && (
          <div className="absolute top-12 -left-10 ">
            <ColorPicker
              currentColor={currentColor}
              handleColorChange={handleColorChange}
              setIsColorPickerOpen={setIsColorPickerOpen}
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <label className="block text-xs font-medium text-white mb-1">
          Ebene
        </label>
        <div className="flex items-center gap-1">
          <Layers size={16} className="text-gray-600" />
          <input
            type="number"
            value={currentLayer}
            onChange={(e) => handleZIndexChange(Number(e.target.value) + 31)}
            className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            min="0"
            max="30"
            step="1"
          />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
