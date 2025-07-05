"use client";
import ItemModal from "@/components/ItemModal";
import TextBlock from "@/components/TextBlock";
import Toolbar from "@/components/Toolbar";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useItemsPositions } from "@/stores/ItemsPositionsProvider";
import { useItems } from "@/stores/ItemsProvider";
import { FunctionComponent, useEffect, useState } from "react";
import { Plus, Save, Edit3, X, Sticker, Type } from "lucide-react";

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

      setHasChanges(false);
      setIsSaved(false);

      // Exit edit mode after successful save
      setIsEditMode(false);
      setIsEditMenuOpen(false);
      setSelectedTextBlockId(null);
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

  // Filter out text block items from regular items to avoid duplicates
  const filterTextBlockItems = (items: any[]) => {
    return items.filter((item) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(item.element, "text/html");
      const div = doc.querySelector("div");
      // Return false if this is a text block (has div with position absolute and text content)
      return !(div && div.textContent && div.style.position === "absolute");
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
  }, [items]);

  // Initialize savedTextBlocks when textBlocks are loaded from database
  useEffect(() => {
    if (textBlocks.length > 0 && savedTextBlocks.length === 0) {
      // Only set if savedTextBlocks is empty (initial load)
      setSavedTextBlocks([...textBlocks]);
    }
  }, [textBlocks, savedTextBlocks.length]);

  useEffect(() => {
    if (isItemModalOpen || isEditMode) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    if (isItemModalOpen) {
      document.body.classList.add("border-2");
      document.body.classList.add("border-cyan-500");
    } else {
      document.body.classList.remove("border-2");
      document.body.classList.remove("border-cyan-500");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
      document.body.classList.remove("border-2");
      document.body.classList.remove("border-cyan-500");
    };
  }, [isItemModalOpen, isEditMode]);

  // Check if text blocks have changed
  useEffect(() => {
    const textBlocksChanged =
      JSON.stringify(textBlocks) !== JSON.stringify(savedTextBlocks);
    setHasUnsavedTextBlocks(textBlocksChanged && textBlocks.length > 0);
  }, [textBlocks, savedTextBlocks]);

  // Check if we have unsaved changes from text blocks or regular items
  useEffect(() => {
    if (newItems.length > 0 || hasUnsavedTextBlocks) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [newItems.length, hasUnsavedTextBlocks]);

  // Show save button only when there are changes AND user is logged in
  const showSaveButton = hasChanges && user;

  // Debug logging
  console.log("Debug Save Button:", {
    hasChanges,
    hasUnsavedTextBlocks,
    newItemsLength: newItems.length,
    user: !!user,
    showSaveButton,
    textBlocksLength: textBlocks.length,
    savedTextBlocksLength: savedTextBlocks.length,
  });

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

      {/* Modal Overlay */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}

      {/* Toolbar - Show when text block is selected or being edited in edit mode */}
      {showToolbar && <Toolbar />}

      {/* Bottom Left Edit Menu */}
      <div className="fixed bottom-4 left-4 flex flex-col items-center gap-2 z-40">
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
      {isItemModalOpen && user && <ItemModal toggleModal={toggleModal} />}

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
