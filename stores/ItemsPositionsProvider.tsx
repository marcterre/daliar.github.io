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
    } catch (error) {
      console.error("Error saving items to the database:", error);
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
