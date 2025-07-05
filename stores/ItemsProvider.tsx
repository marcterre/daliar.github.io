"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  FunctionComponent,
  useState,
} from "react";

type Item = {
  id: string;
  element: JSX.Element;
  position: { x: number; y: number };
};

type TextBlock = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  isEditing: boolean;
  zIndex: number;
};

type ItemsState = {
  isItemModalOpen: boolean;
  setIsItemModalOpen: (isOpen: boolean) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  textBlocks: TextBlock[];
  setTextBlocks: React.Dispatch<React.SetStateAction<TextBlock[]>>;
  addTextBlock: () => void;
  updateTextBlock: (id: string, updates: Partial<TextBlock>) => void;
  deleteTextBlock: (id: string) => void;
  globalFontFamily: string;
  setGlobalFontFamily: (font: string) => void;
  globalFontSize: number;
  setGlobalFontSize: (size: number) => void;
  globalColor: string;
  setGlobalColor: (color: string) => void;
  globalZIndex: number;
  setGlobalZIndex: (zIndex: number) => void;
  loadTextBlocksFromItems: (items: any[]) => void;
  selectedTextBlockId: string | null;
  setSelectedTextBlockId: (id: string | null) => void;
  updateSelectedTextBlock: (updates: Partial<TextBlock>) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isDraggingAny: boolean;
  setIsDraggingAny: (isDragging: boolean) => void;
};

interface ItemsProviderProps {
  children: ReactNode;
}

const Items = createContext<ItemsState | undefined>(undefined);

export const ItemsProvider: FunctionComponent<ItemsProviderProps> = ({
  children,
}: ItemsProviderProps) => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Roboto");

  const [textBlocks, setTextBlocks] = useState<TextBlock[]>([]);
  const [globalFontFamily, setGlobalFontFamily] = useState("Inter");
  const [globalFontSize, setGlobalFontSize] = useState(16);
  const [globalColor, setGlobalColor] = useState("#000000");
  const [globalZIndex, setGlobalZIndex] = useState(35);
  const [selectedTextBlockId, setSelectedTextBlockId] = useState<string | null>(
    null
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDraggingAny, setIsDraggingAny] = useState(false);

  const addTextBlock = () => {
    const newId = Date.now().toString();
    const newTextBlock: TextBlock = {
      id: newId,
      text: "",
      x: 100,
      y: 100,
      fontFamily: globalFontFamily,
      fontSize: globalFontSize,
      color: globalColor,
      zIndex: globalZIndex,
      isEditing: true,
    };
    setTextBlocks((prev) => [...prev, newTextBlock]);
    setSelectedTextBlockId(newId); // Auto-select the new text block
  };

  const updateTextBlock = (id: string, updates: Partial<TextBlock>) => {
    setTextBlocks((prev) =>
      prev.map((block) => (block.id === id ? { ...block, ...updates } : block))
    );
  };

  const updateSelectedTextBlock = (updates: Partial<TextBlock>) => {
    if (selectedTextBlockId) {
      updateTextBlock(selectedTextBlockId, updates);
    }
  };

  const deleteTextBlock = (id: string) => {
    setTextBlocks((prev) => prev.filter((block) => block.id !== id));
    // Clear selection if the deleted block was selected
    if (selectedTextBlockId === id) {
      setSelectedTextBlockId(null);
    }
  };

  const parseStyleString = (styleString: string) => {
    const styles: any = {};
    styleString.split(";").forEach((style) => {
      const [property, value] = style.split(":").map((s) => s.trim());
      if (property && value) {
        styles[property] = value;
      }
    });
    return styles;
  };

  const loadTextBlocksFromItems = (items: any[]) => {
    const textBlockItems = items.filter((item) => {
      // Check if the item element contains a div with text content (TextBlock)
      const parser = new DOMParser();
      const doc = parser.parseFromString(item.element, "text/html");
      const div = doc.querySelector("div");
      return div && div.textContent && div.style.position === "absolute";
    });

    const convertedTextBlocks: TextBlock[] = textBlockItems
      .map((item) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(item.element, "text/html");
        const div = doc.querySelector("div");

        if (div) {
          const styles = parseStyleString(div.getAttribute("style") || "");

          return {
            id: item.id,
            text: div.textContent || "",
            x: parseInt(styles.left) || item.position_x || 0,
            y: parseInt(styles.top) || item.position_y || 0,
            fontFamily: styles["font-family"]?.replace(/'/g, "") || "Inter",
            fontSize: parseInt(styles["font-size"]) || 16,
            color: styles.color || "#000000",
            zIndex: parseInt(styles["z-index"]) || 35,
            isEditing: false,
          };
        }

        return null;
      })
      .filter(Boolean) as TextBlock[];

    setTextBlocks(convertedTextBlocks);
  };

  return (
    <Items.Provider
      value={{
        isItemModalOpen,
        setIsItemModalOpen,
        selectedFont,
        setSelectedFont,
        textBlocks,
        setTextBlocks,
        addTextBlock,
        updateTextBlock,
        deleteTextBlock,
        globalFontFamily,
        setGlobalFontFamily,
        globalFontSize,
        setGlobalFontSize,
        globalColor,
        setGlobalColor,
        globalZIndex,
        setGlobalZIndex,
        loadTextBlocksFromItems,
        selectedTextBlockId,
        setSelectedTextBlockId,
        updateSelectedTextBlock,
        isEditMode,
        setIsEditMode,
        isDraggingAny,
        setIsDraggingAny,
      }}
    >
      {children}
    </Items.Provider>
  );
};

export const useItems = (): ItemsState => {
  const context = useContext(Items);
  if (!context) {
    throw new Error("useItems must be used within a ItemsProvider");
  }
  return context;
};
