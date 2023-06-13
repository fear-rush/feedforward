import { useEffect, useRef } from "react";

import { UserAuth } from "../../context/AuthContext";

const ChatBubble = ({ message }) => {
  const { user: currentUser } = UserAuth();
  const messageRef = useRef(null);

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={messageRef}>
      {message.senderId === currentUser.uid ? (
        <div className="bg-indigo-100 text-gray-800 ml-auto w-fit p-2 rounded-lg mb-4 relative">
          <div>{message.text}</div>

          <div className="absolute right-0 top-1/2 transform translate-x-1/2 rotate-45 w-2 h-2 bg-indigo-100"></div>
        </div>
      ) : (
        <div className=" bg-indigo-400 text-white w-fit p-2 mr-auto rounded-lg mb-4 relative ">
          <div>{message.text}</div>
          <div className="absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-indigo-400"></div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
