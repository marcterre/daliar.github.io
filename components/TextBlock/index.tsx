"use client";
import React, { useState, useRef, useEffect } from "react";
import { useItems } from "@/stores/ItemsProvider";
import { useItemsPositions } from "@/stores/ItemsPositionsProvider";
import { Trash2, Move } from "lucide-react";

interface TextBlockProps {
  block: {
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
}

const TextBlock: React.FC<TextBlockProps> = ({ block }) => {
  const {
    updateTextBlock,
    deleteTextBlock,
    selectedTextBlockId,
    setSelectedTextBlockId,
    isEditMode,
    isDraggingAny,
    setIsDraggingAny,
  } = useItems();
  const { deleteTextBlockFromDatabase } = useItemsPositions();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: block.x, y: block.y });
  const [isHovered, setIsHovered] = useState(false);
  const [isControlsHovered, setIsControlsHovered] = useState(false);
  const [inputText, setInputText] = useState(block.text);
  const [textWidth, setTextWidth] = useState(0);
  const [originalText, setOriginalText] = useState(block.text);
  const elementRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textMeasureRef = useRef<HTMLSpanElement>(null);

  const isSelected = selectedTextBlockId === block.id;

  useEffect(() => {
    if (block.isEditing && inputRef.current) {
      inputRef.current.focus();
      setInputText(block.text);
      setOriginalText(block.text);
    }
  }, [block.isEditing]);

  // Update drag position when block position changes
  useEffect(() => {
    setDragPosition({ x: block.x, y: block.y });
  }, [block.x, block.y]);

  // Measure text width
  useEffect(() => {
    if (textMeasureRef.current) {
      setTextWidth(textMeasureRef.current.offsetWidth);
    }
  }, [block.text, block.fontFamily, block.fontSize, inputText]);

  // Calculate input width based on text content
  const getInputWidth = () => {
    if (!inputText) return 100; // Minimum width for empty input

    // Create a temporary element to measure text width
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = `${block.fontSize}px ${block.fontFamily}`;
      const textWidth = context.measureText(inputText).width;
      return Math.max(100, textWidth + 20); // Add padding and ensure minimum width
    }

    return Math.max(100, inputText.length * (block.fontSize * 0.6)); // Fallback calculation
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging in edit mode
    if (!isEditMode) return;

    // Don't allow interaction if another TextBlock is being dragged
    if (isDraggingAny && !isDragging) return;

    // Don't start dragging if clicking on input or if editing
    if (block.isEditing || (e.target as HTMLElement).tagName === "INPUT")
      return;

    // Select this text block
    setSelectedTextBlockId(block.id);

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      setIsDraggingAny(true); // Set global dragging state
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Calculate new position with screen boundaries
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Constrain to screen boundaries (ensure element stays fully visible)
      newX = Math.max(0, Math.min(screenWidth - rect.width, newX));
      newY = Math.max(0, Math.min(screenHeight - rect.height, newY));

      // Update visual position immediately for smooth dragging
      setDragPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      // Update the actual position in state
      updateTextBlock(block.id, { x: dragPosition.x, y: dragPosition.y });
      setIsDragging(false);
      setIsDraggingAny(false); // Reset global dragging state
    }
  };

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isEditMode) return;

    // Don't allow interaction if any TextBlock is being dragged
    if (isDraggingAny) return;

    // Prevent event bubbling to avoid triggering drag
    e.stopPropagation();

    // Select this text block
    setSelectedTextBlockId(block.id);

    if (!block.isEditing) {
      updateTextBlock(block.id, { isEditing: true });
      setInputText(block.text);
      setOriginalText(block.text);
    }
  };

  const handleInputBlur = () => {
    // Always save the current input text when blurring
    updateTextBlock(block.id, { text: inputText, isEditing: false });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      updateTextBlock(block.id, { text: inputText, isEditing: false });
    }
    if (e.key === "Escape") {
      setInputText(block.text);
      updateTextBlock(block.id, { isEditing: false });
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
      // Check if the click is on the toolbar
      const toolbar = document.querySelector('[data-toolbar="true"]');
      if (toolbar && toolbar.contains(e.target as Node)) {
        return; // Don't deselect if clicking on toolbar
      }

      if (block.isEditing) {
        // Check if the text block is empty and should be removed
        if (inputText.trim() === "" && originalText.trim() === "") {
          // Remove empty text block
          deleteTextBlock(block.id);
          return;
        }

        // Save the current input text when clicking outside
        updateTextBlock(block.id, { text: inputText, isEditing: false });
      }

      // Deselect if clicking outside (only in edit mode)
      if (isSelected && isEditMode) {
        setSelectedTextBlockId(null);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Only allow deletion in edit mode
    console.log("isEditMode", isEditMode);
    if (!isEditMode) return;

    try {
      // Check if this is an existing text block (not a new one with timestamp ID)
      const isExistingTextBlock = !(
        block.id.length > 10 && /^\d+$/.test(block.id)
      );

      if (isExistingTextBlock) {
        // Delete from database first
        await deleteTextBlockFromDatabase(block.id);
      }

      // Remove from local state
      deleteTextBlock(block.id);
    } catch (error) {
      console.error("Error deleting text block:", error);
      // Still remove from local state even if database deletion fails
      deleteTextBlock(block.id);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [isDragging, dragOffset, dragPosition]);

  useEffect(() => {
    if (block.isEditing || (isSelected && isEditMode)) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [block.isEditing, isSelected, isEditMode, inputText, originalText]);

  // Calculate z-index: higher in edit mode, use block's zIndex otherwise
  const getZIndex = () => {
    if (isDragging) return 9999; // Highest when dragging
    if (isEditMode) return Math.max(block.zIndex, 100); // Much higher in edit mode
    return block.zIndex; // Normal z-index when not in edit mode
  };

  // Only show controls in edit mode and when no TextBlock is being dragged
  const showControls =
    (isHovered || isControlsHovered) &&
    !block.isEditing &&
    isEditMode &&
    !isDraggingAny;

  // Calculate max width considering screen width and delete button space
  const maxWidth = `calc(100vw - 100px)`; // Reserve space for delete button and margins

  return (
    <div
      ref={elementRef}
      className={`absolute group transition-all duration-200 ${
        isSelected && isEditMode ? "ring-2 ring-blue-400 ring-opacity-50" : ""
      } ${
        !block.isEditing && isEditMode
          ? "cursor-grab active:cursor-grabbing"
          : ""
      } ${!isEditMode ? "cursor-default" : ""}`}
      style={{
        left: dragPosition.x,
        top: dragPosition.y,
        fontFamily: block.fontFamily,
        fontSize: `${block.fontSize}px`,
        color: block.color,
        zIndex: getZIndex(),
        transform: isDragging ? "scale(1.02)" : "scale(1)",
        transition: isDragging ? "none" : "transform 0.2s ease",
        maxWidth: maxWidth,
        opacity: !isEditMode
          ? 1
          : block.isEditing || isSelected
          ? 1
          : isDraggingAny && !isDragging
          ? 0.3
          : 0.8,
      }}
      onMouseEnter={() => isEditMode && !isDraggingAny && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
    >
      {/* Hidden text measurer */}
      <span
        ref={textMeasureRef}
        className="absolute invisible whitespace-nowrap"
        style={{
          fontFamily: block.fontFamily,
          fontSize: `${block.fontSize}px`,
          left: "-9999px",
          top: "-9999px",
        }}
      >
        {block.isEditing
          ? inputText || "Click to edit"
          : block.text || "Click to edit"}
      </span>

      {/* Text Content Container */}
      <div className="relative inline-flex items-center">
        {/* Text Content */}
        {block.isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            onClick={(e) => handleTextClick(e)}
            className="bg-transparent border border-blue-400 rounded outline-none"
            placeholder="Enter text..."
            style={{
              fontFamily: block.fontFamily,
              fontSize: `${block.fontSize}px`,
              color: block.color,
              padding: "2px 4px",
              width: Math.max(100, textWidth + 20),
              maxWidth: maxWidth,
              whiteSpace: "nowrap",
            }}
          />
        ) : (
          <div
            className={`inline-block select-none ${
              block.text ? "" : "text-gray-400"
            } ${
              isSelected && isEditMode
                ? "bg-blue-50 bg-opacity-20 px-1 rounded"
                : ""
            }`}
            onClick={(e) => handleTextClick(e)}
            style={{
              maxWidth: maxWidth,
              cursor: isEditMode ? "pointer" : "default",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {block.text || "Click to edit"}
          </div>
        )}

        {/* Delete Button - Positioned to the right of text */}
        {showControls && (
          <button
            onClick={(e) => handleDelete(e)}
            onMouseEnter={() => setIsControlsHovered(true)}
            onMouseLeave={() => setIsControlsHovered(false)}
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            className="ml-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg flex-shrink-0"
            style={{
              zIndex: 9999,
              pointerEvents: "auto",
            }}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Drag Handle - Only show when not editing and hovering */}
      {showControls && (
        <div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded cursor-move flex items-center gap-1 shadow-lg"
          onMouseEnter={() => setIsControlsHovered(true)}
          onMouseLeave={() => setIsControlsHovered(false)}
          style={{ zIndex: 9998 }}
        >
          <Move size={14} />
          <span className="text-xs">Drag</span>
        </div>
      )}
    </div>
  );
};

export default TextBlock;
