"use client";
import React, { useState, useEffect } from "react";
import { useItems } from "@/stores/ItemsProvider";
import { HexColorPicker } from "react-colorful";
import { ChevronDown, Palette, Type, Layers } from "lucide-react";

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

  // Get the selected text block
  const selectedTextBlock = textBlocks.find(
    (block) => block.id === selectedTextBlockId
  );

  // Use selected text block properties or global defaults
  const currentFontFamily = selectedTextBlock?.fontFamily || globalFontFamily;
  const currentFontSize = selectedTextBlock?.fontSize || globalFontSize;
  const currentColor = selectedTextBlock?.color || globalColor;
  const currentZIndex = selectedTextBlock?.zIndex || globalZIndex;

  // Convert internal z-index (31-50) to user-friendly layer (0-30)
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
      // Fallback fonts if no API key
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

    // Load the font immediately
    loadGoogleFont(fontFamily);

    if (selectedTextBlock) {
      // Update only the selected text block
      updateSelectedTextBlock({ fontFamily });
    } else {
      // Update global default for new text blocks
      setGlobalFontFamily(fontFamily);
    }
  };

  const handleFontSizeChange = (size: number) => {
    if (selectedTextBlock) {
      // Update only the selected text block
      updateSelectedTextBlock({ fontSize: size });
    } else {
      // Update global default for new text blocks
      setGlobalFontSize(size);
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedTextBlock) {
      // Update only the selected text block
      updateSelectedTextBlock({ color });
    } else {
      // Update global default for new text blocks
      setGlobalColor(color);
    }
  };

  const handleZIndexChange = (zIndex: number) => {
    // Clamp zIndex between 31 and 50 (above edit layer but below dragging)
    const clampedZIndex = Math.max(31, Math.min(50, zIndex));

    if (selectedTextBlock) {
      // Update only the selected text block
      updateSelectedTextBlock({ zIndex: clampedZIndex });
    } else {
      // Update global default for new text blocks
      setGlobalZIndex(clampedZIndex);
    }
  };

  const loadGoogleFont = (fontFamily: string) => {
    // Check if font is already loaded
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
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 flex items-center gap-4"
    >
      {/* Selection Indicator */}
      {selectedTextBlock && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">
          Selected TextBlock
        </div>
      )}

      {/* Font Family Dropdown */}
      <div className="relative">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Font Family
        </label>
        <button
          onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:border-gray-400 transition-colors min-w-[120px] bg-white text-gray-900"
          style={{ fontFamily: currentFontFamily }}
        >
          <Type size={16} className="text-gray-600" />
          <span className="text-sm text-gray-900">{currentFontFamily}</span>
          <ChevronDown size={14} className="text-gray-600" />
        </button>

        {isFontDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
            {isLoading ? (
              <div className="p-2 text-sm text-gray-500">Loading fonts...</div>
            ) : (
              fonts.map((font) => (
                <button
                  key={font.family}
                  onClick={() => handleFontChange(font.family)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                  style={{ fontFamily: font.family }}
                >
                  {font.family}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Font Size Input */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
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
          className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          min="8"
          max="200"
          step="1"
        />
      </div>

      {/* Color Picker */}
      <div className="relative">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Color
        </label>
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

        {isColorPickerOpen && (
          <div className="absolute top-full left-0 mt-1 p-3 bg-white border border-gray-300 rounded-md shadow-lg z-10">
            <HexColorPicker color={currentColor} onChange={handleColorChange} />
            <div className="mt-2 flex items-center gap-2">
              <input
                type="text"
                value={currentColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-20 px-2 py-1 text-xs border border-gray-300 rounded bg-white text-gray-900"
              />
              <button
                onClick={() => setIsColorPickerOpen(false)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Z-Index Control */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Ebene
        </label>
        <div className="flex items-center gap-1">
          <Layers size={16} className="text-gray-600" />
          <input
            type="number"
            value={currentLayer}
            onChange={(e) => handleZIndexChange(Number(e.target.value) + 31)}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
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
