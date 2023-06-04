const SkeletonStatusFoodCard = () => {
  return (
    <div className="flex flex-col md:flex-row  rounded-lg shadow-cardshadow mt-6">
      <div className="animate-pulse w-full sm:w-auto">
        <div className="w-[300px] h-[300px] mx-auto md:mx-0 rounded-t-md bg-gray-300 "></div>
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

export default SkeletonStatusFoodCard;
