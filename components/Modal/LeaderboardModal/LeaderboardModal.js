import React from "react";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";

const LeaderboardModal = ({
  isLeaderBoardModalOpen,
  setIsLeaderBoardModalOpen,
}) => {
  const getLeaderboard = async () => {
    try {
      const res = await fetch(`${process.env.DEV_URL}/getLeaderboard`);
      const leaderboard = await res.json();
      return leaderboard.data;
    } catch (err) {
      throw new Error(err);
    }
  };

  const {
    isError,
    data: leaderboardData,
    isLoading,
    error,
  } = useQuery({ queryKey: ["leaderboard"], queryFn: getLeaderboard });

  if (isError) {
    return (
      <div className="text-center">
        <h1>Terjadi kesalahan saat mengambil data</h1>
      </div>
    );
  }

  return (
    <>
      <Transition apear show={isLeaderBoardModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsLeaderBoardModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Peringkat Teratas Pembagi Makanan
                  </Dialog.Title>
                  <p className="mt-2 text-sm text-gray-500">
                    Mulai berpartisipasi untuk berbagi makanan dan kumpulkan
                    poin!
                  </p>
                  {isLoading ? (
                    <h1 className="text-center">Loading ...</h1>
                  ) : (
                    leaderboardData.map((data, index) => (
                      <React.Fragment key={index}>
                        <div className="mt-2 flex items-center justify-evenly rounded-lg border-gray-200  shadow-cardshadow h-[50px] bg-white">
                          <p className="flex-none w-1/12 block text-yellow-500 font-bold text-xl ">
                            {index + 1}
                          </p>
                          <p className="flex-none w-1/2  font-medium text-gray-600">
                            {data?.name}
                          </p>
                          <p className="font-medium text-gray-600">{data?.point}</p>
                        </div>
                      </React.Fragment>
                    ))
                  )}

                

                  <div className="mt-4">
                    <button
                      type="button"
                      className="justify-center block ml-auto rounded-md border border-transparent bg-blue-100 px-6 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsLeaderBoardModalOpen(false);
                      }}
                    >
                      OK
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default LeaderboardModal;
