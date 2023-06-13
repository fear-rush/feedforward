import { useRouter } from "next/router";
import FoodDetailView from "../../../components/FoodDetail/FoodDetailView";
import dynamic from "next/dynamic";
import { useFoodById } from "../../../hooks/useFoodById";
import { TrashIcon } from "@heroicons/react/24/outline";
import FoodDetailSkeleton from "../../../components/FoodDetail/FoodDetailSkeleton";
const FabButton = dynamic(
  () => import("../../../components/Button/FabButton"),
  { ssr: false }
);

const FoodDetail = () => {
  const router = useRouter();

  const { isError, data: foodData, isLoading } = useFoodById(router.query.id);

  if (isError) {
    return (
      <div className="mx-auto text-center mt-12">
        <TrashIcon className="w-16 h-16 text-black mx-auto" />
        <h1 className="mt-4 text-lg">Maaf, Makanan Tidak Tersedia</h1>
        <button
          type="button"
          className="bg-blue-400 px-2 py-1 hover:bg-blue-500 text-white rounded-lg mt-2 cursor-pointer"
          onClick={() => {
            router.replace("/home");
          }}
        >
          Kembali ke Home
        </button>
        <FabButton />
      </div>
    );
  }

  return (
    <>
      {isLoading ? <FoodDetailSkeleton /> : <FoodDetailView {...foodData} />}
      <FabButton />
    </>
  );
};

export default FoodDetail;
