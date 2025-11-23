import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const CardCarousel = ({ cards }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
      // Reset startIndex when visibleCount changes to prevent out of bounds
      setStartIndex(0);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(prev - visibleCount, 0));
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      Math.min(prev + visibleCount, cards.length - visibleCount)
    );
  };

  const visibleCards = cards.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="container w-full h-full relative flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-12 gap-4 sm:gap-2">
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={`left-button ${startIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} sm:absolute sm:left-0`}
      >
        <FaArrowLeft size={25} className="cursor-pointer" />
      </button>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto">
        {visibleCards.map((card, index) => (
          <div key={index} className="card w-full sm:w-auto max-w-[280px] sm:max-w-none">
            <div>
              <span className="w-[120px] h-[120px] sm:w-[150px] sm:h-[150px] bg-gray-800 block rounded-full mx-auto"></span>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-base sm:text-lg mb-2">{card.title}</h3>
              <p className="text-sm sm:text-base">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={startIndex + visibleCount >= cards.length}
        className={`right-button ${startIndex + visibleCount >= cards.length ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} sm:absolute sm:right-0`}
      >
        <FaArrowRight size={25} className="cursor-pointer" />
      </button>
    </div>
  );
};

export default CardCarousel;
