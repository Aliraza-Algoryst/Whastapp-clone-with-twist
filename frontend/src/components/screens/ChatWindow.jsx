import React, { useState, useEffect, useRef } from "react";
import EmojiPicker from "emoji-picker-react";
import { images } from "../../assets/images/images";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  selectOnlineUsers,
  selectRoomFetced,
  selectUser,
  selectMassages,
  selectGetmassageLoader,
  selectMassageSendLoader,
  selectIstyping,
  selectsetgetunreadState,
} from "../../selectors/selector";
import {
  unSubscribeToMassages,
  // subscribeToMassages,
  getAllMassage,
  sendMassage,
  istyping,
  socket,
} from "../../redux/action";
import { capitalizeWords, timeAgo } from "../../utils/utils";

/**
 * Chat-bubble style shimmer skeleton.
 * Uses Tailwind animate-pulse; also includes visible contrast sizes so it is noticeable.
 */
const MassageShimmer = () => {
  return (
    <div className="px-10 pt-5 pb-6 flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, i) => {
        const left = i % 2 === 0;
        return (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              left ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`rounded-lg p-3 ${
                left
                  ? " bg-gradient-to-bl from-gray-200 to-gray-400"
                  : "bg-gradient-to-bl from-teal-200 to-green-400"
              } animate-pulse w-[40%]`}
            >
              <div className="h-3 bg-zinc-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-200 rounded w-1/2" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ChatWindow = () => {
  const { pathname } = useLocation();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState("");
  const onlineUsers = useSelector(selectOnlineUsers);
  const messages = useSelector(selectMassages);
  const getMassaegLoader = useSelector(selectGetmassageLoader);
  const clickedroom = useSelector(selectRoomFetced);
  const checkIstyping = useSelector(selectIstyping);
  const getunreadState = useSelector(selectsetgetunreadState);
  const messagesEndRef = useRef(null);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileSetting, setshowProfileSetting] = useState(false);

  // Emoji reactions state
  const [reactionPickerVisible, setReactionPickerVisible] = useState(null);
  const [messageReactions, setMessageReactions] = useState({});

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!clickedroom?._id) return;

    const payload = {
      senderId: clickedroom.senderId,
      receiverId: clickedroom.receiverId,
      roomId: clickedroom._id,
    };

    dispatch(getAllMassage(payload));

    return () => {
      dispatch(unSubscribeToMassages());
    };
  }, [clickedroom?._id, dispatch]);

  const typingtrue = {
    check: true,
    roomId: clickedroom?._id,
    userId: user?._id,
  };
  const typingfalse = {
    check: false,
    roomId: clickedroom?._id,
    userId: user?._id,
  };

  useEffect(() => {
    if (message?.length !== 0) {
      dispatch(istyping(typingtrue));
      const t = setTimeout(() => {
        dispatch(istyping(typingfalse));
      }, 3000);
      return () => clearTimeout(t);
    } else {
      dispatch(istyping(typingfalse));
    }
  }, [message, dispatch]);
  useEffect(() => {
    if (!clickedroom) return;
    socket.emit("unread_massage", getunreadState);
  }, [clickedroom, getunreadState, messages, dispatch]);

  const isUserSender = user?._id === clickedroom?.senderId?._id;
  const otherUser = isUserSender
    ? clickedroom?.receiverId
    : clickedroom?.senderId;

  const handleSendMassage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload = {
      senderId: user?._id,
      receiverId: otherUser?._id,
      massage: message,
      roomId: clickedroom?._id,
      createdAt: Date.now(),
      senderUnread: 0,
      receiverUnread: 0,
    };

    console.log("PAYLOAD MESSAGE", payload);
    dispatch(sendMassage(payload));
    socket.emit("request_rooms", user?._id);
    setMessage("");
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleReactionClick = (messageId, emojiData) => {
    setMessageReactions((prev) => {
      const currentReactions = prev[messageId] || [];
      if (currentReactions.includes(emojiData.emoji)) return prev;
      return {
        ...prev,
        [messageId]: [emojiData.emoji],
      };
    });
    setReactionPickerVisible(null);
  };

  if (!clickedroom || !otherUser) return null;

  const isOnline =
    Array.isArray(onlineUsers) && otherUser?._id
      ? onlineUsers.includes(otherUser._id)
      : false;

  return (
    <div className="grid grid-cols-12">
      <div
        className={`flex flex-col justify-between max-sm:h-[90lvh] h-[100lvh] ${
          showProfileSetting ? "col-span-8" : "col-span-12"
        } w-full bgimage overflow-hidden`}
      >
        {/* Header */}
        <div className="bg-white flex justify-between items-center sm:px-4 px-1 py-4 shadow-sm">
          <div className="flex items-center">
            <img
              onClick={() => navigate(-1)}
              className="rotate-90 w-8 sm:hidden me-2"
              src={images.dropIcon}
              alt=""
            />
            <div className="relative">
              <img
                className="w-12 h-12 rounded-full"
                src={otherUser?.profilepic}
                alt="user"
              />
              <span
                className={`absolute bottom-1 right-0 w-4 h-4 rounded-full border-2 border-white ${
                  isOnline ? "bg-green-700" : "bg-gray-400"
                }`}
              />
            </div>

            <div className="text-md flex flex-col ms-2">
              <div className="font-medium">{otherUser?.fullname}</div>
              <div className="text-gray-400 text-sm">
                {checkIstyping?.check &&
                checkIstyping.userId !== user?._id &&
                checkIstyping?.roomId === clickedroom._id ? (
                  <div className="text-green-600 font-bold">Typing...</div>
                ) : (
                  `${isOnline ? "Online" : "Offline"}`
                )}{" "}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="p-2 rounded-full cursor-pointer bg-gray-100">
              <img className="w-6 h-6" src={images.Video} alt="video icon" />
            </div>
            <div className="p-2 rounded-full cursor-pointer bg-gray-100">
              <img className="w-6 h-6" src={images.Call} alt="call icon" />
            </div>
            <div
              onClick={() => setshowProfileSetting(!showProfileSetting)}
              className="p-1.5 flex items-center gap-0.5 rounded-full bg-gray-100 cursor-pointer"
            >
              <div className="p-1 h-2 w-2 rounded-full bg-gray-300" />
              <div className="p-1 h-2 w-2 rounded-full bg-gray-300" />
              <div className="p-1 h-2 w-2 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto w-full flex flex-col gap-4 px-10 pt-5 relative">
          {getMassaegLoader ? (
            // SHOW SHIMMER WHEN LOADING
            <MassageShimmer />
          ) : !Array.isArray(messages) || messages.length === 0 ? (
            <div className="flex justify-center h-lvh items-center text-gray-500">
              Send Your First Massage to start Chat
            </div>
          ) : (
            <>
              {messages?.map((msg, key) => {
                const isSender = msg.senderId === user._id;

                return (
                  <div
                    key={msg._id || key}
                    className={`relative p-3 text-sm rounded-lg w-fit max-w-[75%] my-4 break-words ${
                      isSender
                        ? "self-end bg-gradient-to-bl from-teal-200 to-green-400 text-black"
                        : "self-start bg-gradient-to-bl from-gray-200 to-gray-400 text-gray-800"
                    }`}
                  >
                    {msg.massage}
                    <div className="text-[10px] mt-1 opacity-70 text-right">
                      {capitalizeWords(timeAgo(new Date(msg?.createdAt)))}
                    </div>

                    <div
                      className={`absolute cursor-pointer ${
                        isSender ? "bottom-2 -left-10" : "bottom-2 -right-10"
                      }`}
                      onClick={() =>
                        setReactionPickerVisible((prev) =>
                          prev === msg._id ? null : msg._id
                        )
                      }
                    >
                      <img src={images.Smiley} alt="react" />
                    </div>

                    {reactionPickerVisible === msg._id && (
                      <div
                        className={`absolute ${
                          isSender
                            ? "-bottom-14 sm:-left-60 -left-20"
                            : "bottom-14 left-0"
                        } rounded-4xl z-50 shadow-md`}
                      >
                        <EmojiPicker
                          onEmojiClick={(e) => handleReactionClick(msg._id, e)}
                          reactionsDefaultOpen={true}
                          allowExpandReactions={false}
                          height={250}
                          width={280}
                          style={{ backgroundColor: "transparent" }}
                        />
                      </div>
                    )}

                    {messageReactions[msg._id]?.length > 0 && (
                      <div className="absolute -bottom-6 right-2 text-2xl flex gap-1">
                        {messageReactions[msg._id].map((emoji, index) => (
                          <span key={index}>{emoji}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {checkIstyping?.check &&
                checkIstyping.userId !== user?._id &&
                checkIstyping?.roomId === clickedroom._id && (
                  <div className="relative group">
                    <div
                      className="relative group p-2 tooltip cursor-pointer text-sm rounded-lg w-fit max-w-[75%] my-4 break-words 
                self-start bg-green-100 text-gray-800"
                    >
                      <svg
                        width="40"
                        height="20"
                        viewBox="0 0 60 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10" r="5" fill="#25D366">
                          <animate
                            attributeName="cy"
                            values="10;5;10"
                            dur="0.6s"
                            repeatCount="indefinite"
                            begin="0s"
                          />
                        </circle>
                        <circle cx="30" cy="10" r="5" fill="#25D366">
                          <animate
                            attributeName="cy"
                            values="10;5;10"
                            dur="0.6s"
                            repeatCount="indefinite"
                            begin="0.2s"
                          />
                        </circle>
                        <circle cx="50" cy="10" r="5" fill="#25D366">
                          <animate
                            attributeName="cy"
                            values="10;5;10"
                            dur="0.6s"
                            repeatCount="indefinite"
                            begin="0.4s"
                          />
                        </circle>
                      </svg>
                    </div>
                    <div className="absolute -top-3 transform w-max px-2 py-1 text-sm text-black bg-green-300 rounded shadow-lg opacity-0 group-hover:opacity-100">
                      Typing...
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Footer Input */}
        <form
          onSubmit={(e) => {
            handleSendMassage(e);
          }}
        >
          <div
            className={`relative max-sm:fixed bottom-0 w-full bg-white/90 py-4 px-5 flex items-end gap-2 ${
              pathname !== "/chat" && "hidden"
            }`}
          >
            <div className="w-11/12 relative">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full ps-12 bg-gray-200 p-3 outline-none rounded-4xl"
                placeholder="Type a message"
                type="text"
              />
              <img
                className="w-7 h-7 absolute left-2.5 top-2 cursor-pointer"
                src={images.Smiley}
                alt="emoji"
                onClick={() => {
                  setShowEmojiPicker((prev) => !prev);
                  setReactionPickerVisible(null);
                }}
              />
              <img
                className="w-7 h-7 absolute right-2.5 top-2 cursor-pointer"
                src={images.Paperclip}
                alt="attach"
              />
              {showEmojiPicker && (
                <div className="absolute bottom-15 left-0 z-50 shadow-md">
                  <EmojiPicker
                    searchPlaceholder="Search emojis..."
                    onEmojiClick={handleEmojiClick}
                    autoFocusSearch={true}
                    lazyLoadEmojis={false}
                    emojiStyle="native"
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              // onClick={handleSendMassage}
              className="p-2.5 bg-green-500 rounded-full cursor-pointer"
            >
              <img className="w-7 h-7" src={images.Microphone} alt="mic" />
            </button>
          </div>
        </form>
      </div>

      {/* profile sidebar unchanged: you can re-add if needed */}
    </div>
  );
};

export default ChatWindow;
