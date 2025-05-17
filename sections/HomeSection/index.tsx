"use client";
import ItemModal from "@/components/ItemModal";
import TextBlock from "@/components/TextBlock";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useItemsPositions } from "@/stores/ItemsPositionsProvider";
import { useItems } from "@/stores/ItemsProvider";
import { FunctionComponent, useEffect } from "react";

type HomeSectionProps = {
  items:
    | {
        id: string;
        element: string;
        position_x: number;
        position_y: number;
      }[];
};

const HomeSection: FunctionComponent<HomeSectionProps> = ({ items }) => {
  const { user } = useAuthentication();
  const {
    isItemModalOpen,
    setIsItemModalOpen,
    isTextBlockOpen,
    setIsTextBlockOpen,
  } = useItems();
  const {
    saveNewItemsToDatabase,
    setItems,
    newItems,
    hasChanges,
    setHasChanges,
    setIsSaved,
  } = useItemsPositions();

  const toggleModal = () => {
    setIsItemModalOpen(!isItemModalOpen);
    setIsTextBlockOpen(false);
  };

  const handleSave = async () => {
    await saveNewItemsToDatabase().then(() => {
      setHasChanges(false);
      setIsSaved(false);
    });
  };

  useEffect(() => {
    setItems(items);
  }, [items]);

  useEffect(() => {
    if (isItemModalOpen || isTextBlockOpen) {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("border-2");
      document.body.classList.add("border-cyan-500");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.body.classList.remove("border-2");
      document.body.classList.remove("border-cyan-500");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.body.classList.remove("border-2");
      document.body.classList.remove("border-cyan-500");
    };
  }, [isItemModalOpen, isTextBlockOpen]);

  return (
    <div className="w-screen h-screen grid content-center text-center relative">
      {(isItemModalOpen || isTextBlockOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      )}
      {user && (
        <button
          type="button"
          onClick={toggleModal}
          className="z-50 absolute bottom-20 left-10 bg-blue-500 text-white font-bold py-2 px-4 w-fit rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          +
        </button>
      )}
      {isItemModalOpen && user && <ItemModal toggleModal={toggleModal} />}
      {!isItemModalOpen && isTextBlockOpen && <TextBlock />}
      {hasChanges && (
        <button
          onClick={handleSave}
          className="z-50 absolute bottom-20 right-10"
        >
          save
        </button>
      )}
      {items?.map((item, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: item.element }} />
      ))}
      {newItems.map((item, index) => {
        return (
          <div key={index} dangerouslySetInnerHTML={{ __html: item.element }} />
        );
      })}
    </div>
  );
};

export default HomeSection;
