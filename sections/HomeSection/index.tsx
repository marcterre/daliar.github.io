"use client";
import ItemModal from "@/components/ItemModal";
import TextBlock from "@/components/TextBlock";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useItems } from "@/stores/ItemsProvider";
import { useEffect } from "react";

const HomeSection = () => {
  const { user } = useAuthentication();
  const {
    isItemModalOpen,
    setIsItemModalOpen,
    isTextBlockOpen,
    setIsTextBlockOpen,
  } = useItems();

  const toggleModal = () => {
    setIsItemModalOpen(!isItemModalOpen);
    setIsTextBlockOpen(false);
  };

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
      {isTextBlockOpen && user && !isItemModalOpen && <TextBlock />}
    </div>
  );
};

export default HomeSection;
