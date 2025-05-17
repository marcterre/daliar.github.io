import React from "react";
import { useItems } from "@/stores/ItemsProvider";
import { useEffect, useState } from "react";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY;

const FontDropdown = () => {
  const [fonts, setFonts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { selectedFont, setSelectedFont } = useItems();

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/webfonts/v1/webfonts?sort=POPULARITY&key=${API_KEY}`
        );
        const data = await response.json();
        const first50Fonts = data.items.slice(0, 50);
        setFonts(first50Fonts);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch fonts");
        setIsLoading(false);
      }
    };
    fetchFonts();
  }, []);

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    setIsOpen(false);
  };

  if (isLoading) return <div className="text-gray-600">Loading fonts...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="relative w-[300px] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left cursor-pointer flex justify-between items-center hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <span style={{ fontFamily: selectedFont }}>{selectedFont}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-10">
          <div className="py-2">
            {fonts.map((font: any) => (
              <div
                key={font.family}
                onClick={() => handleFontChange(font.family)}
                className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-gray-50 ${
                  selectedFont === font.family ? "bg-gray-50" : ""
                }`}
              >
                <span className="text-gray-900">{font.family}</span>
                <span
                  style={{ fontFamily: font.family }}
                  className="text-gray-500"
                >
                  {font.family}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontDropdown;
