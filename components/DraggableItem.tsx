import React from "react";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

type DraggableItemProps = {
  id: string;
  children: JSX.Element;
  initialPosition: { x: number; y: number };
};

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  children,
  initialPosition,
}) => {
  const { bind } = useDragAndDrop({ id, initialPosition });

  return <div {...bind}>{children}</div>;
};
