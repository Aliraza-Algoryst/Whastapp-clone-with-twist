import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import { Link, useNavigate } from "react-router";
import FriendrequestModel from "../common/FriendrequestModel";
import { useDispatch, useSelector } from "react-redux";
import { getunRead, logout, selectroom, socket } from "../../redux/action";
import { timeAgo } from "../../utils/utils";
import {
  selectIstyping,
  selectOnlineUsers,
  selectRoom,
  selectRoomFetced,
  selectRoomLoader,
  selectSocket,
  selectUser,
} from "../../selectors/selector";
import { capitalizeWords } from "../../utils/utils";
import Status from "../common/Status";
import { success } from "../../redux/builder";

const SidebarScreen = () => {
  const onlineUsers = useSelector(selectOnlineUsers);
  const checkIstyping = useSelector(selectIstyping);
  const clickedroom = useSelector(selectRoomFetced);
  const roomLoader = useSelector(selectRoomLoader);
  const socketdata = useSelector(selectSocket);
  const user = useSelector(selectUser);
  const room = useSelector(selectRoom);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = user?._id;

  const [showfrientpopup, setShowfriendpopup] = useState(false);
  const [getnotification, setgetnotification] = useState(0);
  // const [getunreadState, setgetunreadState] = useState({});
  const [openStatus, setopenStatus] = useState(false);
  const [showmenue, setshowmenue] = useState(false);

  // useEffect(() => {
  //   if (!clickedroom || !getunreadState._id) return;
  //   socket.emit("unread_massage", getunreadState);
  // }, [clickedroom, getunreadState._id]);

  // useEffect(() => {
  //   if (!socketdata) return;

  //   // Listen for rooms once
  //   socket.on("get_rooms", (room) => {
  //     dispatch(success({ type: "GET_ROOM_SUCCESFULL", success: room }));
  //   });

  //   if (userId) {
  //     socket.emit("request_rooms", userId); // send as object
  //   }
  // }, [socketdata]);

  const handlelogout = async () => {
    await dispatch(logout());
    navigate("/login");
  };

  const users = [
    { name: "John" },
    { name: "Ali raza" },
    { name: "Maria" },
    { name: "Zebra" },
    { name: "Cheta" },
    { name: "JohMonkey" },
  ];

  return (
    <div className="h-lvh mx-1">
      <div className="my-3 flex justify-between items-center">
        <div className="flex items-center gap-1">
          <div className="rounded-full h-3 w-3 bg-[#EC6A5F]"></div>
          <div className="rounded-full h-3 w-3 bg-[#F4BF4F]"></div>
          <div className="rounded-full h-3 w-3 bg-[#61C554]"></div>
        </div>

        <div className="flex relative items-center gap-2">
          <img
            onClick={() => navigate("/profile")}
            className="cursor-pointer"
            src={images.edit}
            alt="edit icon"
          />
          <img
            onClick={() => setshowmenue(!showmenue)}
            className="cursor-pointer"
            src={images.dropIcon}
            alt="menu icon"
          />
          {showmenue && (
            <div className="absolute px-5 py-4 space-y-10 top-8 -left-10 z-10 bg-gray-200 rounded-lg">
              <Link to="/profile">
                <div className="cursor-pointer">Profile</div>
              </Link>
              <div onClick={handlelogout} className="cursor-pointer">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mt-7 relative">
        <input
          className="bg-[#F2F3F5] w-full outline-none text-gray-400 text-sm rounded-3xl ps-10 pe-4 h-[35px]"
          type="text"
          placeholder="Search or start new chat"
        />
        <img
          className="absolute left-0 top-2 ps-2"
          src={images.searchIcon}
          alt="search icon"
        />
      </div>

      {/* Status */}
      <div>
        <div className="mt-3 ps-1 font-bold">STATUS</div>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center w-max gap-4 py-3">
          <div className="flex flex-col items-center">
            <div className="w-[50px] h-[50px] bg-gray-300 rounded-full relative">
              <div className="absolute top-2 left-2">
                <img
                  className="border-2 rounded-full border-green-600 border-dashed p-2"
                  src={images.statusplusIcon}
                  alt="add status"
                />
              </div>
            </div>
            <div className="font-medium text-sm mt-1">Add</div>
          </div>

          {users?.map((user, idx) => (
            <div
              onClick={() => setopenStatus(!openStatus)}
              key={idx}
              className="cursor-pointer flex flex-col items-center"
            >
              <div className="border-2 border-green-600 rounded-full p-1">
                <div className="w-[50px] h-[50px] bg-gray-300 rounded-full"></div>
              </div>
              <div className="font-medium text-sm mt-1">{user.name}</div>
            </div>
          ))}
          {openStatus && <Status setopenStatus={setopenStatus} />}
        </div>
      </div>

      {/* All Chats */}
      <div className="py-4 flex justify-between items-center">
        <div className="mt-2 text-lg font-bold uppercase">All Chats</div>
        <div
          className="cursor-pointer"
          onClick={() => setShowfriendpopup(!showfrientpopup)}
        >
          <svg width="48" height="48" viewBox="0 0 48 48">
            <path
              d="m24 42c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2Zm8-6v-7c0-3.9-2.5-7.1-6-8V20c0-.8-.7-1.5-1.5-1.5S23 19.2 23 20v1c-3.5.9-6 4.1-6 8v7l-2 2v1h20v-1l-2-2Z"
              fill="#111827"
            />
            <circle cx="33" cy="15" r="6" fill="#EF4444" />
            <text
              x="33"
              y="19"
              textAnchor="middle"
              fontSize="10"
              fill="white"
              fontWeight="bold"
            >
              {getnotification}
            </text>
          </svg>
        </div>
        {showfrientpopup && (
          <FriendrequestModel
            setgetnotification={setgetnotification}
            showfrientpopup={showfrientpopup}
            setShowfriendpopup={setShowfriendpopup}
          />
        )}
      </div>

      {/* Chat List */}
      <div className="w-full bg-white">
        <div className="w-full max-h-[100lvh] overflow-y-auto no-scrollbar bg-white">
          {roomLoader ? (
            <div className="mt-6 space-y-4 px-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center animate-pulse space-x-4"
                >
                  <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-gray-300 rounded w-3/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : room?.room?.length === 0 ? (
            <div className="text-gray-400 text-center mt-40">
              Please make friend to send messages
            </div>
          ) : (
            <>
              {room?.room
                ?.slice() // make a copy so we don't mutate original
                .sort((a, b) => {
                  // First: sort by last message time (newest first)
                  const timeA = new Date(a?.lastmassagetime || 0).getTime();
                  const timeB = new Date(b?.lastmassagetime || 0).getTime();
                  if (timeB !== timeA) {
                    return timeB - timeA; // newer comes first
                  }

                  // Second: sort by unread count (higher unread first)
                  const unreadA = a?.senderUnread + a?.receiverUnread || 0;
                  const unreadB = b?.senderUnread + b?.receiverUnread || 0;
                  return unreadB - unreadA;
                })
                .map((chat, index) => {
                  const isUserSender = userId === chat?.senderId?._id;
                  const otherUser = isUserSender
                    ? chat?.receiverId
                    : chat?.senderId;

                  const isOnline =
                    Array.isArray(onlineUsers) && otherUser?._id
                      ? onlineUsers.includes(otherUser._id)
                      : false;

                  const isActive = clickedroom?._id === chat?._id;

                  return (
                    <Link to={`/chat`} key={index}>
                      <div
                        onClick={() => {
                          dispatch(selectroom({ ...chat, isUserSender }));
                          dispatch(getunRead({ ...chat, isUserSender }));
                        }}
                        className={`flex items-center py-2 transition cursor-pointer ${
                          isActive &&
                          "rounded-lg text-white bg-gradient-to-bl from-teal-400 to-green-400"
                        }`}
                      >
                        {/* Profile image */}
                        <div className="relative rounded-full w-14 ms-2 overflow-hidden mr-4">
                          <img
                            src={otherUser?.profilepic}
                            alt={otherUser?.fullname}
                            className="w-full h-full object-cover rounded-full"
                          />
                          <span
                            className={`absolute bottom-3 right-0 w-4 h-4 rounded-full border-2 border-white ${
                              isOnline ? "bg-green-700" : "bg-gray-400"
                            }`}
                          ></span>
                        </div>

                        {/* Chat info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-bold pb-1 text-md">
                              {capitalizeWords(otherUser?.fullname)}
                            </p>
                            <span className="text-xs pe-2">
                              {capitalizeWords(
                                timeAgo(new Date(chat?.lastmassagetime))
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="text-sm truncate w-[200px]">
                              {checkIstyping?.check &&
                              checkIstyping.userId !== user?._id &&
                              checkIstyping?.roomId === chat._id ? (
                                <div className= { `${isActive ?"text-black":"text-green-500 font-bold"} font-bold`}>
                                  Typing...
                                </div>
                              ) : (
                                chat?.lastmassage || "Last message here"
                              )}
                            </div>

                            {isUserSender && chat?.senderUnread > 0 && (
                              <span className="text-[10px] me-2 bg-black pt-0.5 text-white h-5 w-5 flex items-center justify-center rounded-full">
                                {chat.senderUnread}
                              </span>
                            )}

                            {!isUserSender && chat?.receiverUnread > 0 && (
                              <span className="text-[10px] me-2 bg-black pt-0.5 text-white h-5 w-5 flex items-center justify-center rounded-full">
                                {chat.receiverUnread}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SidebarScreen;
