"use client";
import ItemModal from "@/components/ItemModal";
import TextBlock from "@/components/TextBlock";
import Toolbar from "@/components/Toolbar";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useItemsPositions } from "@/stores/ItemsPositionsProvider";
import { useItems } from "@/stores/ItemsProvider";
import { FunctionComponent, useEffect, useState } from "react";
import { Save, Edit3, X, Sticker, Type, Palette } from "lucide-react";
import Button from "@/components/Button";
import ColorPicker from "@/components/ColorPicker";

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
    if (!isEditMode) return;
    setIsItemModalOpen(!isItemModalOpen);
  };

  const handleSave = async () => {
    try {
      if (newItems.length > 0) {
        await saveNewItemsToDatabase();
      }

      if (textBlocks.length > 0) {
        await saveTextBlocksToDatabase(textBlocks);
        setSavedTextBlocks([...textBlocks]);
        setHasUnsavedTextBlocks(false);
      }

      if (hasUnsavedBackgroundColor) {
        await saveBackgroundColorToDatabase();
        setSavedBackgroundColor(backgroundColor);
        setHasUnsavedBackgroundColor(false);
      }

      setHasChanges(false);
      setIsSaved(false);

      setIsEditMode(false);
      setIsEditMenuOpen(false);
      setSelectedTextBlockId(null);
      setIsBackgroundColorPickerOpen(false);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleAddTextBlock = () => {
    if (!isEditMode) return;
    addTextBlock();
  };

  const toggleEditMenu = () => {
    if (isEditMode) {
      setIsEditMenuOpen(!isEditMenuOpen);
    } else {
      setIsEditMode(true);
      setIsEditMenuOpen(true);
    }
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setIsEditMenuOpen(false);
    setSelectedTextBlockId(null);
    setIsItemModalOpen(false);
    setIsBackgroundColorPickerOpen(false);
    const filteredTextBlocks = textBlocks.filter(
      (block) => block.text.trim() !== ""
    );
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    setHasUnsavedBackgroundColor(true);
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

        if (data.backgroundColor && data.backgroundColor.colorHex) {
          const bgColor = data.backgroundColor.colorHex;
          setBackgroundColor(bgColor);
          setSavedBackgroundColor(bgColor);
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

  const filterTextBlockItems = (items: any[]) => {
    return items.filter((item) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(item.element, "text/html");
      const div = doc.querySelector("div");
      const isTextBlock =
        div && div.textContent && div.style.position === "absolute";

      return !isTextBlock;
    });
  };

  useEffect(() => {
    if (items && items.length > 0) {
      loadTextBlocksFromItems(items);
      const filteredItems = filterTextBlockItems(items);
      setNonTextBlockItems(filteredItems);
      setItems(filteredItems);
    }
    loadBackgroundColorFromDatabase();
  }, [items]);

  useEffect(() => {
    if (backgroundColor) {
      document.body.style.setProperty(
        "background-color",
        backgroundColor,
        "important"
      );
    }
  }, [backgroundColor]);

  useEffect(() => {
    if (textBlocks.length > 0 && savedTextBlocks.length === 0) {
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

  useEffect(() => {
    const textBlocksChanged =
      JSON.stringify(textBlocks) !== JSON.stringify(savedTextBlocks);
    setHasUnsavedTextBlocks(textBlocksChanged && textBlocks.length > 0);
  }, [textBlocks, savedTextBlocks]);

  useEffect(() => {
    const backgroundColorChanged = backgroundColor !== savedBackgroundColor;
    setHasUnsavedBackgroundColor(backgroundColorChanged);
  }, [backgroundColor, savedBackgroundColor]);

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

  const showSaveButton = hasChanges && user;
  const showToolbar =
    isEditMode &&
    (selectedTextBlockId !== null ||
      textBlocks.some((block) => block.isEditing));

  return (
    <div className="w-screen h-screen grid content-center text-center relative">
      {isEditMode && (
        <div className="fixed inset-0 border-4 border-cyan-500 pointer-events-none z-30"></div>
      )}
      {showToolbar && <Toolbar />}
      {isBackgroundColorPickerOpen && (
        <div className="fixed left-4 bottom-56">
          <ColorPicker
            currentColor={backgroundColor}
            handleColorChange={handleBackgroundColorChange}
            setIsColorPickerOpen={setIsBackgroundColorPickerOpen}
          />
        </div>
      )}
      <div className="fixed bottom-2 left-2 grid gap-1 z-40">
        {isEditMode && (
          <>
            <Button
              text="Background"
              handleClick={() =>
                setIsBackgroundColorPickerOpen(!isBackgroundColorPickerOpen)
              }
              type="black"
              icon={<Palette size={24} />}
            />
            <Button
              text="Text"
              handleClick={handleAddTextBlock}
              type="black"
              icon={<Type size={24} />}
            />

            <Button
              text="Add Stickers"
              handleClick={toggleModal}
              type="black"
              icon={<Sticker size={24} />}
            />
          </>
        )}
        <Button
          text={isEditMode ? "Exit" : "Edit"}
          handleClick={() => {
            isEditMode ? exitEditMode() : toggleEditMenu();
          }}
          type="black"
          icon={isEditMode ? <X /> : <Edit3 />}
        />
      </div>
      {showSaveButton && (
        <Button
          text="Save"
          handleClick={handleSave}
          type="black"
          icon={<Save size={20} />}
          className="fixed bottom-2 right-2"
        />
      )}
      {isEditMode && !user && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black border text-white p-1 border-none text-sm font-medium z-40">
          ⚠️ Du bist nicht eingeloggt - Änderungen werden nicht gespeichert
        </div>
      )}
      {isItemModalOpen && <ItemModal toggleModal={toggleModal} />}
      {nonTextBlockItems?.map((item, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: item.element }} />
      ))}
      {newItems.map((item, index) => {
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: item.element }} />
        );
      })}
      {textBlocks.map((block) => (
        <TextBlock key={block.id} block={block} />
      ))}
    </div>
  );
};

export default HomeSection;
