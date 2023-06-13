const LeaderboardSkeleton = () => {
  return (
    <div className="grid h-[100px] bg-gray-100 grid-cols-3 md:grid-cols-4 content-center justify-items-center border-2 rounded-lg mt-4">
      <div className="animate-pulse w-full"></div>
    </div>
  );
};

export default LeaderboardSkeleton;
