import React, { useEffect, useState } from "react";
import { images } from "../../assets/images/images";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAcceptReqeustLoader,
  selectAcceptrequest,
  selectGetReqeustLoader,
  selectGetrequest,
  selectsearchUser,
  selectSearchUserLoader,
  // selectSendReqeustLoader,
  // selectsendrequest,
  selectUser,
} from "../../selectors/selector";
// import { useNavigate } from "react-router";
import {
  acceptRequest,
  getAllRequest,
  getSingleUser,
  sendRequest,
  socket,
} from "../../redux/action";
import { failure, success } from "../../utils/toastutils";

const FriendrequestModel = ({
  setShowfriendpopup,
  showfrientpopup,
  setgetnotification,
}) => {
  const [showWhichScreen, setshowWhichScreen] = useState("request");
  const [getemail, setgetemail] = useState("");
  const searchUser = useSelector(selectsearchUser);
  const user = useSelector(selectUser);
  // const sendrequest = useSelector(selectsendrequest);
  // const sendrequestLoader = useSelector(selectSendReqeustLoader);
  const getReqeustLoader = useSelector(selectGetReqeustLoader);
  const acceptrequestLoader = useSelector(selectAcceptReqeustLoader);
  const acceptrequest = useSelector(selectAcceptrequest);
  const getrequest = useSelector(selectGetrequest);
  const searchUserLoader = useSelector(selectSearchUserLoader);
  const dispatch = useDispatch();
  const findedUser = searchUser?.user;
  const handleSearchUser = () => {
    dispatch(getSingleUser(getemail));
  };
  useEffect(() => {
    const payload = { receiverId: user?._id };
    dispatch(getAllRequest(payload));
    if (!getReqeustLoader) {
      setgetnotification(getrequest?.requests?.length);
    }
  }, [user]);

  const handleAcceptRequest = async (user, isAccepted) => {
    try {
      const payload = {
        requestId: user?._id,
        senderId: user?.senderId,
        receiverId: user?.receiverId,
        isAccepted: isAccepted,
      };
      await dispatch(acceptRequest(payload));
      if (isAccepted) {
        success("Request Accepted successfully!");
      } else {
        success("Request Rejected successfully!");
      }
      setShowfriendpopup(false);
    } catch (error) {
      failure(error.message || "Failed to Perform Action");
      setShowfriendpopup(false);
    }
  };
  const handleSendRequest = async () => {
    try {
      const payload = {
        senderId: user?._id,
        receiverId: findedUser?._id,
      };
      await dispatch(sendRequest(payload));
      success("Request sent successfully!");
      setShowfriendpopup(false);
    } catch (error) {
      failure(error.message || "Failed to send request");
      setShowfriendpopup(false);
    }
  };

  const isAcceptedtrue = true;
  const isAcceptedfalse = false;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="sm:w-[400px] h-[600px] overflow-y-scroll no-scrollbar  bg-white rounded-2xl shadow-lg p-6">
        <div className="">
          {" "}
          <div className="flex justify-between">
            <div className="text-lg font-medium">Create New Chat</div>
            <div
              onClick={() => setShowfriendpopup(!showfrientpopup)}
              className="p-2  cursor-pointer bg-gray-800 rounded-full"
            >
              <img className="w-4 h-4" src={images.crossicon} alt="cros" />
            </div>
          </div>
          <div className="grid grid-cols-12 text-md  gap-2.5 mt-4">
            <div
              onClick={() => setshowWhichScreen("request")}
              className={` col-span-6 text-center p-3  cursor-pointer shadow-sm rounded-md ${
                showWhichScreen === "request" &&
                "border-b-2 border-green-500 bg-gray-300 "
              } `}
            >
              Request
            </div>
            <div
              onClick={() => setshowWhichScreen("newchat")}
              className={` col-span-6 text-center p-3 cursor-pointer shadow-sm rounded-md ${
                showWhichScreen === "newchat" &&
                "border-b-2 border-green-500 bg-gray-300 "
              } `}
            >
              New Chat
            </div>
          </div>
        </div>

        {showWhichScreen == "request" && (
          <>
            {getrequest?.requests?.length === 0 ? (
              <div className="text-center px-20 mt-20 text-gray-300">
                No Request found
              </div>
            ) : (
              <>
                {getReqeustLoader ? (
                  <div className="flex mt-20 justify-center items-center">
                    <img src={images.loader} alt="" />
                  </div>
                ) : (
                  <>
                    {" "}
                    {getrequest?.requests?.map((user) => (
                      <div className="mt-4">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                          <img
                            className="w-15 h-15 rounded-full object-cover border-2 border-gray-200"
                            src={user?.senderId?.profilepic}
                            alt="User"
                          />

                          <div className="flex flex-col justify-center flex-1">
                            <div className="text-base font-semibold text-gray-900">
                              {user?.senderId?.fullname}
                            </div>
                            <div className="text-base font-light text-gray-400">
                              {user?.senderId?.email}
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button
                                onClick={() => {
                                  handleAcceptRequest(user, isAcceptedtrue);
                                }}
                                className="px-4 py-1.5 cursor-pointer text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  handleAcceptRequest(user, isAcceptedfalse);
                                }}
                                className="px-4 py-1.5 cursor-pointer text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </>
        )}
        {showWhichScreen == "newchat" && (
          <>
            {/* Find new person to chat */}
            <div className="mt-7 flex justify-between gap-2 items-center  relative">
              <input
                onChange={(e) => setgetemail(e.target.value)}
                className="bg-gray-300 w-full outline-none  text-gray-800 text-sm rounded-3xl ps-10 pe-4 h-[35px]"
                type="text"
                placeholder=" Search to Find new person with Email for chat"
              />
              <img
                className=" absolute left-0 top-3 ps-2"
                src={images.searchIcon}
                alt=""
              />
              <button
                className="bg-green-200 cursor-pointer text-black p-2 rounded-2xl"
                onClick={() => handleSearchUser()}
              >
                Search
              </button>
            </div>
            {/* request card */}
            {searchUserLoader ? (
              <div className="flex justify-center items-center my-10">
                <img src={images.loader} alt="" />
              </div>
            ) : (
              <>
                {" "}
                {findedUser ? (
                  <div className="mt-4">
                    <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                      <img
                        className="w-15 h-15 rounded-full object-cover border-2 border-gray-200"
                        src={findedUser?.profilepic}
                        alt="User"
                      />

                      <div className="flex flex-col justify-center flex-1">
                        <div className="text-base font-semibold text-gray-900">
                          {findedUser?.fullname}
                        </div>
                        <div className="text-base font-light text-gray-400">
                          {findedUser?.email}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <button
                            onClick={() => {
                              handleSendRequest();
                            }}
                            className="px-4 py-1.5 cursor-pointer text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors"
                          >
                            Send Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center  text-gray-400 my-10 ">
                    No user Found
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FriendrequestModel;
