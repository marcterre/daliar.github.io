"use client";
import ItemModal from "@/components/ItemModal";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useState, useEffect } from "react";

const HomeSection = () => {
  const { user } = useAuthentication();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isModalOpen) {
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
  }, [isModalOpen]);

  return (
    <div className="w-screen h-screen grid content-center text-center relative">
      <h1>daliar</h1>
      <h2>Portfolio</h2>
      {user && (
        <button
          type="button"
          onClick={toggleModal}
          className="absolute bottom-20 left-10 bg-blue-500 text-white font-bold py-2 px-4 w-fit rounded-full hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          +
        </button>
      )}
      {isModalOpen && user && <ItemModal toggleModal={toggleModal} />}
    </div>
  );
};

export default HomeSection;
