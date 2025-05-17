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

type ItemsState = {
  isItemModalOpen: boolean;
  setIsItemModalOpen: (isOpen: boolean) => void;
  isTextBlockOpen: boolean;
  setIsTextBlockOpen: (isOpen: boolean) => void;
  selectedFont: string;
  setSelectedFont: (font: string) => void;
  itemsMap: Map<string, Item>;
  addItem: (item: Item) => void;
  updateItem: (id: string, position: { x: number; y: number }) => void;
  removeItem: (id: string) => void;
};

interface ItemsProviderProps {
  children: ReactNode;
}

const Items = createContext<ItemsState | undefined>(undefined);

export const ItemsProvider: FunctionComponent<ItemsProviderProps> = ({
  children,
}: ItemsProviderProps) => {
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isTextBlockOpen, setIsTextBlockOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState("");
  const [itemsMap, setItemsMap] = useState<Map<string, Item>>(new Map());

  const addItem = (item: Item) => {
    setItemsMap((prev) => new Map(prev).set(item.id, item));
  };

  const updateItem = (id: string, position: { x: number; y: number }) => {
    setItemsMap((prev) => {
      const updatedMap = new Map(prev);
      const item = updatedMap.get(id);
      if (item) {
        updatedMap.set(id, { ...item, position });
      }
      return updatedMap;
    });
  };

  const removeItem = (id: string) => {
    setItemsMap((prev) => {
      const updatedMap = new Map(prev);
      updatedMap.delete(id);
      return updatedMap;
    });
  };

  return (
    <Items.Provider
      value={{
        isItemModalOpen,
        setIsItemModalOpen,
        isTextBlockOpen,
        setIsTextBlockOpen,
        selectedFont,
        setSelectedFont,
        itemsMap,
        addItem,
        updateItem,
        removeItem,
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
