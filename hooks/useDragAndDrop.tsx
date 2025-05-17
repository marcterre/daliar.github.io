import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useItems } from "@/stores/ItemsProvider";

type UseDragAndDropProps = {
  id: string;
  initialPosition: { x: number; y: number };
};

export const useDragAndDrop = ({
  id,
  initialPosition,
}: UseDragAndDropProps) => {
  const { addItem, updateItem } = useItems();
  const [position, setPosition] = useState(initialPosition);
  const isDragging = useRef(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    addItem({
      id,
      position: initialPosition,
      element: <div id={id}></div>,
    });
  }, []);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      isDragging.current = true;
      dragOffset.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [position]
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current) return;

      const newX = Math.max(
        0,
        Math.min(window.innerWidth, e.clientX - dragOffset.current.x)
      );
      const newY = Math.max(
        0,
        Math.min(window.innerHeight, e.clientY - dragOffset.current.y)
      );

      setPosition({ x: newX, y: newY });
      updateItem(id, { x: newX, y: newY });
    },
    [id, updateItem]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  return {
    position,
    bind: {
      style: {
        position: "absolute" as CSSProperties["position"],
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: "grab",
      },
      onMouseDown,
    },
  };
};
