"use client";
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const [showFullButton, setShowFullButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollTop === 0 || scrollTop + clientHeight >= scrollHeight) {
        setShowFullButton(true);
      } else {
        setShowFullButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBackClick = () => {
    router.push("/pages/home");
  };

  return (
    <div className="fixed bottom-4  flex justify-center z-50">
      <button
        onClick={handleBackClick}
        className={`w-full max-w-xs bg-red-600 text-white text-lg font-bold py-3 px-4 rounded-full shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
          showFullButton ? "opacity-100" : "opacity-75"
        }`}
      >
        <FaArrowLeft className="text-xl" />
        {showFullButton && <span>Voltar para Vendas</span>}
      </button>
    </div>
  );
}
