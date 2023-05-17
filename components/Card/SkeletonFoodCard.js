import React from "react";

const SkeletonFoodCard = () => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-cardshadow max-w-[300px]">
      <div className="min-w-full cursor-pointer rounded-lg bg-white">
        <div className="animate-pulse flex-row items-center justify-center space-x-1 rounded-xl">
          <div className="flex flex-col">
            <div className="h-[300px] w-[300px] rounded-t-md bg-gray-300 "></div>
            <div className="h-[200px] p-6">
              <div className="h-6 w-10/12 mt-2 rounded-md bg-gray-300"></div>
              <div className="h-6 w-9/12 mt-3 rounded-md bg-gray-300"></div>
              <div className="h-6 w-8/12 mt-3 rounded-md bg-gray-300 "></div>
              <div className="h-6 w-7/12 mt-3 rounded-md bg-gray-300 "></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFoodCard;
