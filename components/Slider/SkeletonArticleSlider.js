const SkeletonArticleSlider = () => {
  return (
    <div className="flex flex-col max-w-4xl md:flex-row md:justify-center md:items-center rounded-lg shadow-cardshadow mb-14">
      <div className="animate-pulse w-full">
        <div className="h-[300px] rounded-lg bg-gray-300 "></div>
      </div>
    </div>
  );
};

export default SkeletonArticleSlider;
