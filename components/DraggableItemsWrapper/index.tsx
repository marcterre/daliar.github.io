import { useItemsPositions } from "@/stores/ItemsPositionsProvider";
import React, { useState, useRef, ReactNode } from "react";

interface DraggableItemProps {
  children: ReactNode;
  showDragIcon?: boolean;
  onPositionChange?: (x: number, y: number) => void;
  className?: string;
}
const DraggableItemsWrapper: React.FC<DraggableItemProps> = ({
  children,
  showDragIcon = false,
  onPositionChange,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);
  const { positions, setPositions } = useItemsPositions();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && elementRef.current) {
      const parentRect =
        elementRef.current.offsetParent?.getBoundingClientRect();
      const newX = e.clientX - dragOffset.x - (parentRect?.left || 0);
      const newY = e.clientY - dragOffset.y - (parentRect?.top || 0);

      setPositions({ x: newX, y: newY });
      onPositionChange?.(newX, newY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={elementRef}
      className={`z-50 absolute flex items-center gap-2 cursor-move ${className}`}
      style={{
        transform: `translate(${positions.x}px, ${positions.y}px)`,
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      {showDragIcon && (
        <svg
          className="w-5 h-5 text-gray-400 absolute left-[-20px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      )}
      {children}
    </div>
  );
};

export default DraggableItemsWrapper;
