const SkeletonFoodCard = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-center md:items-center rounded-lg shadow-cardshadow max-w-[800px]">
      <div className="animate-pulse">
        <div className="h-[300px] w-[300px] rounded-t-md bg-gray-300 "></div>
      </div>
      <div className="animate-pulse">
        <div className="flex flex-col justify-center h-[300px] md:w-[380px] p-6">
          <div className="h-6 w-10/12 mt-2 rounded-md bg-gray-300"></div>
          <div className="h-6 w-9/12 mt-3 rounded-md bg-gray-300"></div>
          <div className="h-6 w-8/12 mt-3 rounded-md bg-gray-300 "></div>
          <div className="h-6 w-7/12 mt-3 rounded-md bg-gray-300 "></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonFoodCard;
