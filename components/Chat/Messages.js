import { useState, useEffect, Fragment, useRef } from "react";
import { useForm } from "react-hook-form";
import { Dialog, Transition } from "@headlessui/react";
import { v4 as uuid } from "uuid";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  getDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";

import { UserAuth } from "../../context/AuthContext";
import { db } from "../../utils/firebaseconfig";

import ChatBubble from "./ChatBubble";

const Messages = ({
  isChatModalOpen,
  setIsChatModalOpen,
  combinedChatId,
  giver,
  taker,
}) => {
  const [messages, setMessages] = useState([]);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const { user: currentUser } = UserAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    let unmounted = false;
    const getChat = async () => {
      try {
        const chatDocument = await getDoc(doc(db, "chat", combinedChatId));
        if (!chatDocument.exists()) {
          setIsInputDisabled(true);
          await setDoc(doc(db, "chat", combinedChatId), { messages: [] });
          setIsInputDisabled(false);
        }
      } catch (err) {
        setIsChatModalOpen(false);
      }
    };

    if (!unmounted) {
      getChat();
    }

    const unsubscribe = onSnapshot(doc(db, "chat", combinedChatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unmounted = true;
      unsubscribe();
    };
  }, [combinedChatId]);

  const sendMessage = async (data) => {
    setValue("message", "");
    await updateDoc(doc(db, "chat", combinedChatId), {
      messages: arrayUnion({
        id: uuid(),
        text: data.message,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
  };

  return (
    <Transition appear show={isChatModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsChatModalOpen(false)}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-3">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {giver ? giver : taker}
                  </Dialog.Title>
                  <Dialog.Title
                    as="button"
                    className="text-lg font-medium text-red-900 bg-red-100 px-2 w-10 h-10 rounded-full"
                    onClick={() => {
                      setIsChatModalOpen(false);
                    }}
                  >
                    {"\u2715"}
                  </Dialog.Title>
                </div>
                <div className=" bg-white rounded-lg h-[400px] p-2 overflow-y-scroll">
                  {messages.map((message) => (
                    <ChatBubble key={message.id} message={message} />
                  ))}
                </div>

                <form noValidate onSubmit={handleSubmit(sendMessage)}>
                  <div className="flex justify-between items-center mt-4 gap-4">
                    <input
                      type="text"
                      {...register("message")}
                      id="chat"
                      disabled={isInputDisabled}
                      placeholder={
                        isInputDisabled ? "Loading ..." : "Ketikan pesan ..."
                      }
                      className={`w-full rounded-lg border-2 border-gray-200 p-2 ${
                        isInputDisabled ? "bg-gray-300" : null
                      }`}
                    ></input>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-full bg-blue-100 px-3.5 py-2"
                    >
                      {"\u27A4"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Messages;
