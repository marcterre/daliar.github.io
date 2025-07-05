"use client";
import React, {
  createContext,
  useContext,
  ReactNode,
  FunctionComponent,
  useState,
  useEffect,
  SetStateAction,
} from "react";
import { toast } from "react-toastify";

type ItemPosition = {
  id: string;
  element: any;
  position_x: number;
  position_y: number;
};

type ItemsPositionsState = {
  positions: {
    x: number;
    y: number;
  };
  setPositions: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  items: ItemPosition[];
  setItems: React.Dispatch<SetStateAction<ItemPosition[]>>;
  newItems: ItemPosition[];
  setNewItems: React.Dispatch<SetStateAction<ItemPosition[]>>;
  addNewItem: (element: any, position_x: number, position_y: number) => void;
  saveNewItemsToDatabase: () => Promise<void>;
  saveTextBlocksToDatabase: (textBlocks: any[]) => Promise<void>;
  updateTextBlockInDatabase: (textBlock: any) => Promise<void>;
  deleteTextBlockFromDatabase: (textBlockId: string) => Promise<void>;
  hasChanges: boolean;
  setHasChanges: React.Dispatch<SetStateAction<boolean>>;
  isSaved: boolean;
  setIsSaved: React.Dispatch<SetStateAction<boolean>>;
  newElement: any;
  setNewElement: React.Dispatch<SetStateAction<any>>;
};

interface ItemsPositionsProviderProps {
  children: ReactNode;
}

const ItemsPositions = createContext<ItemsPositionsState | undefined>(
  undefined
);

export const ItemsPositionsProvider: FunctionComponent<
  ItemsPositionsProviderProps
> = ({ children }: ItemsPositionsProviderProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [items, setItems] = useState<ItemPosition[]>([]);
  const [newItems, setNewItems] = useState<ItemPosition[]>([]);
  const [positions, setPositions] = useState<{
    x: number;
    y: number;
  }>({ x: 100, y: 100 });
  const [hasChanges, setHasChanges] = useState(false);
  const [newElement, setNewElement] = useState<any>(null);

  const addNewItem = (element: any, position_x: number, position_y: number) => {
    const newItem: ItemPosition = {
      id: BigInt(Date.now()).toString(),
      element,
      position_x,
      position_y,
    };
    console.log("New item added:", newItem);
    setNewItems((prevItems) => [...prevItems, newItem]);
  };

  const saveNewItemsToDatabase = async () => {
    if (newItems.length === 0) return;

    try {
      const response = await fetch("/api/save-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItems),
      });

      if (!response.ok) {
        throw new Error("Failed to save items to the database");
      }

      console.log("Items saved successfully");
      toast.success("Items saved successfully");
      setNewItems([]); // Clear new items after successful save
    } catch (error) {
      console.error("Error saving items to the database:", error);
      toast.error("Failed to save items");
    }
  };

  const saveTextBlocksToDatabase = async (textBlocks: any[]) => {
    if (textBlocks.length === 0) return;

    try {
      // Separate new text blocks (with timestamp IDs) from existing ones
      const newTextBlocks = textBlocks.filter(
        (block) => block.id.length > 10 && /^\d+$/.test(block.id) // Timestamp-based IDs
      );

      const existingTextBlocks = textBlocks.filter(
        (block) => !(block.id.length > 10 && /^\d+$/.test(block.id)) // Non-timestamp IDs
      );

      // Save new text blocks
      if (newTextBlocks.length > 0) {
        const textBlockItems = newTextBlocks.map((block) => ({
          id: block.id,
          element: `<div style="position: absolute; left: ${block.x}px; top: ${block.y}px; font-family: '${block.fontFamily}'; font-size: ${block.fontSize}px; color: ${block.color}; z-index: ${block.zIndex};">${block.text}</div>`,
          position_x: block.x,
          position_y: block.y,
        }));

        const response = await fetch("/api/save-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(textBlockItems),
        });

        if (!response.ok) {
          throw new Error("Failed to save new text blocks to the database");
        }
      }

      // Update existing text blocks
      for (const block of existingTextBlocks) {
        await updateTextBlockInDatabase(block);
      }

      console.log("Text blocks saved successfully");
      toast.success("Text blocks saved successfully");
    } catch (error) {
      console.error("Error saving text blocks to the database:", error);
      toast.error("Failed to save text blocks");
    }
  };

  const updateTextBlockInDatabase = async (textBlock: any) => {
    try {
      const updatedItem = {
        element: `<div style="position: absolute; left: ${textBlock.x}px; top: ${textBlock.y}px; font-family: '${textBlock.fontFamily}'; font-size: ${textBlock.fontSize}px; color: ${textBlock.color}; z-index: ${textBlock.zIndex};">${textBlock.text}</div>`,
        position_x: textBlock.x,
        position_y: textBlock.y,
      };

      const response = await fetch(`/api/update-item/${textBlock.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error("Failed to update text block in the database");
      }
    } catch (error) {
      console.error("Error updating text block in the database:", error);
      throw error;
    }
  };

  const deleteTextBlockFromDatabase = async (textBlockId: string) => {
    try {
      const response = await fetch(`/api/delete-item/${textBlockId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete text block from the database");
      }

      console.log("Text block deleted successfully");
      toast.success("Text block deleted successfully");
    } catch (error) {
      console.error("Error deleting text block from the database:", error);
      toast.error("Failed to delete text block");
      throw error;
    }
  };

  const isElementInItemsArray = (
    newItems: ItemPosition[],
    items: ItemPosition[]
  ) => {
    const newItemId = newItems.map((item) => item.id);
    const existingItemId = items.map((item) => item.id.toString());
    console.log(
      "New item IDs:",
      newItemId,
      "Existing item IDs:",
      existingItemId,
      newItemId.some((id) => existingItemId.includes(id))
    );
    const doesIdExist = newItemId.some((id) => existingItemId.includes(id));
    const isArrayEmpty = newItems.length === 0;
    return doesIdExist || isArrayEmpty;
  };

  useEffect(() => {
    const hasNewChanges = !isElementInItemsArray(newItems, items);
    setHasChanges(hasNewChanges);
  }, [newItems, items]);

  useEffect(() => {
    console.log(positions);
  }, [positions]);

  return (
    <ItemsPositions.Provider
      value={{
        items,
        setItems,
        positions,
        setPositions,
        newItems,
        setNewItems,
        addNewItem,
        saveNewItemsToDatabase,
        saveTextBlocksToDatabase,
        updateTextBlockInDatabase,
        deleteTextBlockFromDatabase,
        hasChanges,
        setHasChanges,
        isSaved,
        setIsSaved,
        newElement,
        setNewElement,
      }}
    >
      {children}
    </ItemsPositions.Provider>
  );
};

export const useItemsPositions = (): ItemsPositionsState => {
  const context = useContext(ItemsPositions);
  if (!context) {
    throw new Error(
      "useItemsPositions must be used within an ItemsPositionsProvider"
    );
  }
  return context;
};
