import { UserAuth } from "../../context/AuthContext";

const ChatBubble = ({ message }) => {
  const { user: currentUser } = UserAuth();
  return (
    <>
      {message.senderId === currentUser.uid ? (
        <div class="bg-indigo-100 text-gray-800 ml-auto w-fit p-2 rounded-lg mb-4 relative">
          <div>{message.text}</div>

          <div class="absolute right-0 top-1/2 transform translate-x-1/2 rotate-45 w-2 h-2 bg-indigo-100"></div>
        </div>
      ) : (
        <div class=" bg-indigo-400 text-white w-fit p-2 mr-auto rounded-lg mb-4 relative ">
          <div>{message.text}</div>
          <div class="absolute left-0 top-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-indigo-400"></div>
        </div>
      )}
    </>
  );
};

export default ChatBubble;
