const FoodDetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 h-[600px] md:h-[800px] mt-6 mb-20 lg:mb-40 mx-auto justify-items-center rounded-lg shadow-cardshadow max-w-5xl">
      <div className="animate-pulse w-full">
        <div className="mx-auto w-[350px] h-[350px] bg-gray-300 rounded-md"></div>
      </div>
      <div className="animate-pulse w-full flex flex-col justify-center items-center">
        <div className="h-6 w-10/12 mt-3 rounded-md bg-gray-300"></div>
        <div className="h-6 w-9/12 mt-3 rounded-md bg-gray-300 "></div>
        <div className="h-6 w-8/12 mt-3 rounded-md bg-gray-300 "></div>
        <div className="h-6 w-7/12 mt-3 rounded-md bg-gray-300 "></div>
      </div>
    </div>
  );
};

export default FoodDetailSkeleton;
