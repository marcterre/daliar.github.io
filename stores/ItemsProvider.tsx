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
  const [selectedFont, setSelectedFont] = useState("Roboto");

  return (
    <Items.Provider
      value={{
        isItemModalOpen,
        setIsItemModalOpen,
        isTextBlockOpen,
        setIsTextBlockOpen,
        selectedFont,
        setSelectedFont,
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
