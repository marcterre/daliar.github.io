import React, {
  createContext,
  useContext,
  ReactNode,
  FunctionComponent,
} from "react";

type ItemPositionState = {};

interface ItemPositionProviderProps {
  children: ReactNode;
}

const ItemPosition = createContext<ItemPositionState | undefined>(undefined);

export const ItemPositionProvider: FunctionComponent<
  ItemPositionProviderProps
> = ({ children }: ItemPositionProviderProps) => {
  return <ItemPosition.Provider value={{}}>{children}</ItemPosition.Provider>;
};

export const useItemPosition = (): ItemPositionState => {
  const context = useContext(ItemPosition);
  if (!context) {
    throw new Error(
      "useItemPosition must be used within a ItemPositionProvider"
    );
  }
  return context;
};
