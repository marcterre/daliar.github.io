"use client";
import ItemModal from "@/components/ItemModal";
import TextBlock from "@/components/TextBlock";
import Toolbar from "@/components/Toolbar";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useItemsPositions } from "@/stores/ItemsPositionsProvider";
import { useItems } from "@/stores/ItemsProvider";
import { FunctionComponent, useEffect, useState } from "react";
import { Plus, Save, Edit3, X, Sticker, Type, Palette } from "lucide-react";
import { HexColorPicker } from "react-colorful";

type HomeSectionProps = {
  items:
    | {
        id: string;
        element: string;
        position_x: number;
        position_y: number;
      }[];
};

const HomeSection: FunctionComponent<HomeSectionProps> = ({ items }) => {
  const { user } = useAuthentication();
  const {
    isItemModalOpen,
    setIsItemModalOpen,
    textBlocks,
    addTextBlock,
    selectedTextBlockId,
    setSelectedTextBlockId,
    loadTextBlocksFromItems,
    isEditMode,
    setIsEditMode,
  } = useItems();
  const {
    saveNewItemsToDatabase,
    saveTextBlocksToDatabase,
    setItems,
    newItems,
    hasChanges,
    setHasChanges,
    setIsSaved,
  } = useItemsPositions();

  const [hasUnsavedTextBlocks, setHasUnsavedTextBlocks] = useState(false);
  const [savedTextBlocks, setSavedTextBlocks] = useState<any[]>([]);
  const [nonTextBlockItems, setNonTextBlockItems] = useState<any[]>([]);
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isBackgroundColorPickerOpen, setIsBackgroundColorPickerOpen] =
    useState(false);
  const [hasUnsavedBackgroundColor, setHasUnsavedBackgroundColor] =
    useState(false);
  const [savedBackgroundColor, setSavedBackgroundColor] = useState("#ffffff");

  const toggleModal = () => {
    if (!isEditMode) return; // Only allow modal in edit mode
    setIsItemModalOpen(!isItemModalOpen);
    // Keep edit menu open for easy access to both options
  };

  const handleSave = async () => {
    try {
      // Save regular items
      if (newItems.length > 0) {
        await saveNewItemsToDatabase();
      }

      // Save text blocks
      if (textBlocks.length > 0) {
        await saveTextBlocksToDatabase(textBlocks);
        setSavedTextBlocks([...textBlocks]); // Update saved state
        setHasUnsavedTextBlocks(false);
      }

      // Save background color
      if (hasUnsavedBackgroundColor) {
        await saveBackgroundColorToDatabase();
        setSavedBackgroundColor(backgroundColor);
        setHasUnsavedBackgroundColor(false);
      }

      setHasChanges(false);
      setIsSaved(false);

      // Exit edit mode after successful save
      setIsEditMode(false);
      setIsEditMenuOpen(false);
      setSelectedTextBlockId(null);
      setIsBackgroundColorPickerOpen(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleAddTextBlock = () => {
    if (!isEditMode) return; // Only allow adding in edit mode
    addTextBlock();
    // Keep edit menu open for adding multiple text blocks
  };

  const toggleEditMenu = () => {
    if (isEditMode) {
      setIsEditMenuOpen(!isEditMenuOpen);
    } else {
      // Enter edit mode
      setIsEditMode(true);
      setIsEditMenuOpen(true);
    }
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setIsEditMenuOpen(false);
    setSelectedTextBlockId(null);

    // Remove any empty text blocks when exiting edit mode
    const filteredTextBlocks = textBlocks.filter(
      (block) => block.text.trim() !== ""
    );
    if (filteredTextBlocks.length !== textBlocks.length) {
      // Update text blocks to remove empty ones
      // This will be handled by the TextBlock component's cleanup logic
    }
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    setHasUnsavedBackgroundColor(true);
    // Apply background color immediately with !important to override CSS
    document.body.style.setProperty("background-color", color, "important");
  };

  const saveBackgroundColorToDatabase = async () => {
    try {
      const response = await fetch("/api/save-background-color", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          colorHex: backgroundColor,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save background color");
      }

      const result = await response.json();
      console.log("Background color saved successfully:", result);
    } catch (error) {
      console.error("Error saving background color:", error);
      throw error;
    }
  };

  const loadBackgroundColorFromDatabase = async () => {
    try {
      const response = await fetch("/api/get-background-color");
      if (response.ok) {
        const data = await response.json();
        console.log("Loaded background data:", data);

        // The API now returns { backgroundColor: singleObject } instead of array
        if (data.backgroundColor && data.backgroundColor.colorHex) {
          const bgColor = data.backgroundColor.colorHex;
          setBackgroundColor(bgColor);
          setSavedBackgroundColor(bgColor);
          // Apply background color with !important to override CSS
          document.body.style.setProperty(
            "background-color",
            bgColor,
            "important"
          );
        }
      }
    } catch (error) {
      console.error("Error loading background color:", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  // Filter out text block items from regular items to avoid duplicates
  const filterTextBlockItems = (items: any[]) => {
    return items.filter((item) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(item.element, "text/html");
      const div = doc.querySelector("div");

      // Return false if this is a text block (has div with position absolute and text content)
      const isTextBlock =
        div && div.textContent && div.style.position === "absolute";

      return !isTextBlock;
    });
  };

  useEffect(() => {
    if (items && items.length > 0) {
      // Load text blocks from database items
      loadTextBlocksFromItems(items);

      // Filter out text block items from regular items
      const filteredItems = filterTextBlockItems(items);
      setNonTextBlockItems(filteredItems);
      setItems(filteredItems);
    }

    // Load background color from database
    loadBackgroundColorFromDatabase();
  }, [items]);

  // Apply background color whenever it changes
  useEffect(() => {
    if (backgroundColor) {
      document.body.style.setProperty(
        "background-color",
        backgroundColor,
        "important"
      );
    }
  }, [backgroundColor]);

  // Initialize savedTextBlocks when textBlocks are loaded from database
  useEffect(() => {
    if (textBlocks.length > 0 && savedTextBlocks.length === 0) {
      // Only set if savedTextBlocks is empty (initial load)
      setSavedTextBlocks([...textBlocks]);
    }
  }, [textBlocks, savedTextBlocks.length]);

  useEffect(() => {
    if (isEditMode) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isEditMode]);

  // Check if text blocks have changed
  useEffect(() => {
    const textBlocksChanged =
      JSON.stringify(textBlocks) !== JSON.stringify(savedTextBlocks);
    setHasUnsavedTextBlocks(textBlocksChanged && textBlocks.length > 0);
  }, [textBlocks, savedTextBlocks]);

  // Check if background color has changed
  useEffect(() => {
    const backgroundColorChanged = backgroundColor !== savedBackgroundColor;
    setHasUnsavedBackgroundColor(backgroundColorChanged);
  }, [backgroundColor, savedBackgroundColor]);

  // Check if we have unsaved changes from text blocks, background color, or regular items
  useEffect(() => {
    if (
      newItems.length > 0 ||
      hasUnsavedTextBlocks ||
      hasUnsavedBackgroundColor
    ) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [newItems.length, hasUnsavedTextBlocks, hasUnsavedBackgroundColor]);

  // Show save button only when there are changes AND user is logged in
  const showSaveButton = hasChanges && user;

  // Show toolbar when a text block is selected or when adding/editing (and in edit mode)
  const showToolbar =
    isEditMode &&
    (selectedTextBlockId !== null ||
      textBlocks.some((block) => block.isEditing));

  return (
    <div className="w-screen h-screen grid content-center text-center relative">
      {/* Edit Mode Overlay */}
      {isEditMode && (
        <div className="fixed inset-0 border-2 border-blue-500 pointer-events-none z-30"></div>
      )}
      {/* Toolbar - Show when text block is selected or being edited in edit mode */}
      {showToolbar && <Toolbar />}

      {/* Background Color Picker Overlay */}
      {isBackgroundColorPickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Background Color
              </h3>
              <button
                onClick={() => setIsBackgroundColorPickerOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <HexColorPicker
                color={backgroundColor}
                onChange={handleBackgroundColorChange}
              />

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => handleBackgroundColorChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-center font-mono text-sm bg-white text-gray-900"
                  placeholder="#ffffff"
                />
                <button
                  onClick={() => copyToClipboard(backgroundColor)}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Left Edit Menu */}
      <div className="fixed bottom-4 left-4 flex flex-col items-center gap-2 z-40">
        {/* Background Color Button - Only show in edit mode */}
        {isEditMode && (
          <button
            type="button"
            onClick={() =>
              setIsBackgroundColorPickerOpen(!isBackgroundColorPickerOpen)
            }
            className={`text-gray-800 font-bold p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg transform border-2 border-white ${
              isEditMenuOpen
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-95 pointer-events-none"
            }`}
            title="Change Background Color"
            style={{
              backgroundColor: backgroundColor,
              transitionDelay: isEditMenuOpen ? "0.15s" : "0s",
            }}
          >
            <Palette size={24} />
          </button>
        )}

        {/* Text Block Button - Only show in edit mode */}
        {isEditMode && (
          <button
            type="button"
            onClick={handleAddTextBlock}
            className={`bg-purple-500 text-white font-bold p-3 rounded-full hover:bg-purple-700 transition-all duration-300 ease-in-out shadow-lg transform ${
              isEditMenuOpen
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-95 pointer-events-none"
            }`}
            title="Add Text Block"
            style={{ transitionDelay: isEditMenuOpen ? "0.1s" : "0s" }}
          >
            <Type size={24} />
          </button>
        )}

        {/* Sticker Button - Only show in edit mode */}
        {isEditMode && (
          <button
            type="button"
            onClick={toggleModal}
            className={`bg-blue-500 text-white font-bold p-3 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg transform ${
              isEditMenuOpen
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-95 pointer-events-none"
            }`}
            title="Add Stickers"
            style={{ transitionDelay: isEditMenuOpen ? "0.05s" : "0s" }}
          >
            <Sticker size={24} />
          </button>
        )}

        {/* Main Edit Button / Close Button */}
        <button
          type="button"
          onClick={
            isEditMode
              ? isEditMenuOpen
                ? exitEditMode
                : toggleEditMenu
              : toggleEditMenu
          }
          className={`font-bold p-3 rounded-full transition-all duration-300 ease-in-out shadow-lg transform ${
            isEditMode
              ? isEditMenuOpen
                ? "bg-red-500 text-white hover:bg-red-700 rotate-90"
                : "bg-orange-500 text-white hover:bg-orange-700 rotate-0"
              : "bg-green-500 text-white hover:bg-green-700 rotate-0"
          }`}
          title={
            isEditMode
              ? isEditMenuOpen
                ? "Exit Edit Mode"
                : "Open Menu"
              : "Enter Edit Mode"
          }
        >
          {isEditMode ? (
            isEditMenuOpen ? (
              <X size={24} />
            ) : (
              <Edit3 size={24} />
            )
          ) : (
            <Edit3 size={24} />
          )}
        </button>
      </div>

      {/* Save Button - Only show when there are changes AND user is logged in */}
      {showSaveButton && (
        <button
          onClick={handleSave}
          className="fixed bottom-4 right-4 bg-orange-500 text-white font-bold p-3 rounded-full hover:bg-orange-700 transition duration-300 ease-in-out shadow-lg flex items-center gap-2"
          title="Save All Changes"
        >
          <Save size={20} />
        </button>
      )}

      {/* Warning for non-logged-in users in edit mode */}
      {isEditMode && !user && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-40">
          ⚠️ Du bist nicht eingeloggt - Änderungen werden nicht gespeichert
        </div>
      )}

      {/* Modal */}
      {isItemModalOpen && <ItemModal toggleModal={toggleModal} />}

      {/* Render existing non-text-block items */}
      {nonTextBlockItems?.map((item, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: item.element }} />
      ))}

      {/* Render new items */}
      {newItems.map((item, index) => {
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: item.element }} />
        );
      })}

      {/* Render Text Blocks */}
      {textBlocks.map((block) => (
        <TextBlock key={block.id} block={block} />
      ))}
    </div>
  );
};

export default HomeSection;
