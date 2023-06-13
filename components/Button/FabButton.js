import { useState } from "react";
import { useRouter } from "next/router";
import { BeatLoader } from "react-spinners";
import dynamic from "next/dynamic";

const ShareFoodConfirmationModal = dynamic(
  () => import("../Modal/FoodShareModal/ShareFoodConfirmationModal"),
  { ssr: false }
);
const FormModal = dynamic(() => import("../Modal/FoodShareModal/FormModal"), {
  ssr: false,
});

const FabButton = () => {
  const [isShareFoodModalOpen, setIsShareFoodModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isFoodShareSuccessModalOpen, setIsFoodShareSuccessModalOpen] =
    useState(true);
  const [foodShareLoading, setFoodShareLoading] = useState(false);
  const [isFoodShareSuccess, setIsFoodShareSuccess] = useState(false);
  const router = useRouter();

  const override = {
    borderColor: "blue",
    marginTop: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
    position: "fixed",
    left: "50%",
    top: "50%",
  };

  return (
    <>
      <div className="fixed z-10 w-screen sm:w-[500px] h-20 sm:h-28 -translate-x-1/2 bg-gray-50 border border-gray-200 sm:rounded-full bottom-0 lg:bottom-4 left-1/2">
        <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
          <button
            disabled={foodShareLoading}
            type="button"
            className={`group inline-flex flex-col items-center justify-center rounded-l-full group cursor-pointer ${
              foodShareLoading ? "cursor-auto" : "hover:bg-gray-100 "
            }`}
            onClick={() =>
              router.push({ pathname: "/home" }, undefined, {
                shallow: true,
              })
            }
          >
            <svg
              className={`w-8 h-8 sm:w-10 sm:h-10 text-gray-500   ${
                foodShareLoading ? "cursor-auto" : "group-hover:text-blue-600 "
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>

            <p className="text-xs mt-1 sm:text-base sm:mt-0">Home</p>
          </button>

          <div className="flex flex-col items-center justify-center">
            <button
              data-tooltip-target="tooltip-new"
              type="button"
              disabled={foodShareLoading}
              className={`group inline-flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 font-medium bg-blue-600 rounded-full group focus:ring-4 focus:ring-blue-300 focus:outline-none ${
                foodShareLoading ? "cursor-auto" : "hover:bg-blue-700 "
              }`}
              onClick={() => {
                setIsShareFoodModalOpen(true);
              }}
            >
              <svg
                className="h-6 w-6 sm:w-8 sm:h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                ></path>
              </svg>
            </button>
            <p className="text-xs mt-1 sm:text-base sm:mt-0">Bagikan Makanan</p>
          </div>

          <button
            data-tooltip-target="tooltip-profile"
            disabled={foodShareLoading}
            type="button"
            className={`group inline-flex flex-col items-center justify-center px-5 rounded-r-full group ${
              foodShareLoading ? "cursor-auto" : "hover:bg-gray-100 "
            }`}
            onClick={() =>
              router.push({ pathname: "/profile" }, undefined, {
                shallow: true,
              })
            }
          >
            <svg
              className={`w-8 h-8 sm:w-10 sm:h-10 mb-1 text-gray-500   ${
                foodShareLoading ? "cursor-auto" : "group-hover:text-blue-600 "
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              ></path>
            </svg>
            <span className="sr-only">Profile</span>

            <p className="text-xs mt-1 sm:text-base sm:mt-0">Profile</p>
          </button>
        </div>
      </div>

      {foodShareLoading && !isFoodShareSuccess && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-25"></div>
          <BeatLoader
            color="#000"
            loading={foodShareLoading}
            cssOverride={override}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </>
      )}

      {!foodShareLoading && isFoodShareSuccess && (
        <ShareFoodConfirmationModal
          isFoodShareSuccessModalOpen={isFoodShareSuccessModalOpen}
          setIsFoodShareSuccessModalOpen={setIsFoodShareSuccessModalOpen}
        />
      )}

      {isShareFoodModalOpen && (
        <FormModal
          isShareFoodModalOpen={isShareFoodModalOpen}
          setIsShareFoodModalOpen={setIsShareFoodModalOpen}
          isMapModalOpen={isMapModalOpen}
          setIsMapModalOpen={setIsMapModalOpen}
          setFoodShareLoading={setFoodShareLoading}
          setIsFoodShareSuccess={setIsFoodShareSuccess}
        />
      )}
    </>
  );
};

export default FabButton;
