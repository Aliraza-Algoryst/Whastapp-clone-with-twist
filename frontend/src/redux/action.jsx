import {
  ACCEPT_REQUEST,
  GET_ALL_REQUEST,
  GET_ALL_ROOM,
  GET_MASSAGES,
  GET_SINGLE_USER,
  LOGIN_URL,
  REGISTER_URL,
  SEND_MASSAGE,
  SEND_REQUEST,
} from "../routes/routes";
import { postApi } from "../utils/api_methods";
import { successs } from "../utils/toastutils";
import { failure, request, success } from "./builder";
import { io } from "socket.io-client";

const BASE_BACK_URL = "http://localhost:5000";

export let socket = io(BASE_BACK_URL, {
  autoConnect: false,
  auth: {
    userId: "",
  },
});

export const connectSocket = () => async (dispatch, getState) => {
  const state = getState();
  const user = state?.user;

  if (!user) return;
  socket = io(BASE_BACK_URL, {
    autoConnect: false,
    auth: {
      userId: user._id,
    },
  });

  if (!socket.connected) {
    socket.connect();

    socket.once("connect", () => {
      dispatch(
        success({
          type: "SOCKET_SET_SUCCESFULL",
          success: socket.id,
        })
      );
    });
    socket.on("getOnlineUsers", (usersId) => {
      dispatch(success({ type: "GET_ONLINE_USERS", success: usersId }));
    });

    socket.once("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
  }
};

export const disconnectSocket = () => async (dispatch, getState) => {
  const store = getState();
  if (store.socket?.connected) socket.disconnect();
};

//Actions For Website
export const register = (credentials) => async (dispatch) => {
  dispatch(request({ type: "SIGNUP_REQUEST" }));
  try {
    const user = await postApi({
      url: REGISTER_URL,
      credentials,
    });

    dispatch(
      success({
        type: "SIGNUP_SUCCESFULL",
        success: user?.data?.user,
      })
    );

    localStorage.setItem("user", JSON.stringify(user?.data?.user));
    await dispatch(connectSocket());
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    dispatch(
      failure({
        type: "SIGNUP_FAILURE",
        error: errorMessage,
      })
    );

    throw new Error(errorMessage);
  }
};
export const login = (credentials) => async (dispatch) => {
  dispatch(request({ type: "LOGIN_REQUEST" }));
  try {
    const user = await postApi({
      url: LOGIN_URL,
      credentials,
    });

    dispatch(
      success({
        type: "LOGIN_SUCCESFULL",
        success: user?.data?.user,
      })
    );
    await dispatch(connectSocket());

    localStorage.setItem("user", JSON.stringify(user?.data?.user));
  } catch (error) {
    const errorMessage =
      error.response?.data?.massage || "Something went wrong";
    dispatch(
      failure({
        type: "LOGIN_FAILURE",
        error: errorMessage,
      })
    );

    throw new Error(errorMessage);
  }
};
export const hanldeNotification = () => async () => {
  try {
    successs("New Massage Received");
  } catch (error) {
    console.log(error);
  }
};

// export const getAllRoom = () => async (dispatch, getState) => {
//   const state = getState();
//   const user = state?.user?._id;
//   dispatch(request({ type: "GET_ROOM_REQUEST" }));
//   try {
//     socket.emit("request_rooms", user);

//     socket.on("get_rooms", (room) => {
//       dispatch(
//         success({
//           type: "GET_ROOM_SUCCESFULL",
//           success: room,
//         })
//       );
//     });
//   } catch (error) {
//     const errorMessage =
//       error.response?.data?.message || "Something went wrong";
//     dispatch(
//       failure({
//         type: "GET_ROOM_FAILURE",
//         error: errorMessage,
//       })
//     );

//     throw new Error(errorMessage);
//   }
// };
export const getSingleUser = (credentials) => async (dispatch) => {
  dispatch(request({ type: "GET_SINGLE_USER_REQUEST" }));
  try {
    const singleUser = await postApi({
      url: GET_SINGLE_USER,
      credentials: { email: credentials },
    });

    dispatch(
      success({
        type: "GET_SINGLE_USER_SUCCESFULL",
        success: singleUser?.data,
      })
    );
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Something went wrong";
    dispatch(
      failure({
        type: "GET_SINGLE_USER_FAILURE",
        error: errorMessage,
      })
    );

    throw new Error(errorMessage);
  }
};
export const sendRequest = (credentials) => async (dispatch) => {
  dispatch(request({ type: "SEND_REQUEST_REQUEST" }));
  try {
    const request = await postApi({
      url: SEND_REQUEST,
      credentials,
    });

    dispatch(
      success({
        type: "SEND_REQUEST_SUCCESFULL",
        success: request?.data,
      })
    );
  } catch (error) {
    const errorMessage =
      error.response?.data?.massage || "Something went wrong";
    dispatch(
      failure({
        type: "SEND_REQUEST_FAILURE",
        error: errorMessage,
      })
    );

    throw new Error(errorMessage);
  }
};
export const getAllRequest = (credentials) => async (dispatch) => {
  dispatch(request({ type: "GET_ALL_REQUEST_REQUEST" }));
  try {
    const getrequest = await postApi({
      url: GET_ALL_REQUEST,
      credentials,
    });

    dispatch(
      success({
        type: "GET_ALL_REQUEST_SUCCESFULL",
        success: getrequest?.data,
      })
    );
  } catch (error) {
    const errorMessage =
      error.response?.data?.massage || "Something went wrong";
    dispatch(
      failure({
        type: "GET_ALL_REQUEST_FAILURE",
        error: errorMessage,
      })
    );

    throw new Error(errorMessage);
  }
};
export const acceptRequest = (credentials) => async (dispatch) => {
  dispatch(request({ type: "ACCEPT_REQUEST_REQUEST" }));
  try {
    const acceptrequest = await postApi({
      url: ACCEPT_REQUEST,
      credentials,
    });

    dispatch(
      success({
        type: "ACCEPT_REQUEST_SUCCESFULL",
        success: acceptrequest?.data,
      })
    );
  } catch (error) {
    const errorMessage =
      error.response?.data?.massage || "Something went wrong";
    dispatch(
      failure({
        type: "ACCEPT_REQUEST_FAILURE",
        error: errorMessage,
      })
    );

    throw new Error(errorMessage);
  }
};
export const sendMassage = (credentials) => async (dispatch) => {
  dispatch(request({ type: "SEND_MASSAGE_REQUEST" }));
  try {
    // const massage = await postApi({
    //   url: SEND_MASSAGE,
    //   credentials,
    // });

    // const fetchedRoom = state?.roomFetced;

    socket.emit("send_massage", credentials);
    dispatch(
      success({
        type: "SEND_MASSAGE_SUCCESFULL",
        success: credentials,
      })
    );
    // socket.on("receive_massage", (massage) => {});
  } catch (error) {
    const errorMessage =
      error.response?.data?.massage || "Something went wrong";
    dispatch(
      failure({
        type: "SEND_MASSAGE_FAILURE",
        error: errorMessage,
      })
    );

    throw new Error(errorMessage);
  }
};
export const istyping = (credentials) => async (dispatch) => {
  dispatch(request({ type: "IS_TYPING_REQUEST" }));
  try {
    // const massage = await postApi({
    //   url: SEND_MASSAGE,
    //   credentials,
    // });

    socket.emit("start_typing", credentials);
    // socket.on("is_typing", (backendresponse) => {
    //   dispatch(
    //     success({
    //       type: "IS_TYPING_REQUEST_SUCCESSFULL",
    //       success: backendresponse,
    //     })
    //   );
    // });
  } catch (error) {
    dispatch(
      failure({
        type: "IS_TYPING_REQUEST_SUCCESSFULL",
        error: error,
      })
    );

    throw new Error(error);
  }
};
export const getAllMassage = (credentials) => async (dispatch) => {
  dispatch(request({ type: "GET_MASSAGES_REQUEST" }));

  socket.emit("get_all_massages", credentials);

  const onMessages = (messages) => {
    dispatch(
      success({
        type: "GET_MASSAGES_SUCCESFULL",
        success: messages,
      })
    );
    socket.off("all_messages", onMessages);
  };

  socket.on("all_messages", onMessages);
};

export const subscribeToMassages = () => async (dispatch, getState) => {
  const state = getState();

  const allRoom = await state?.room;
  const allRoomLoader = state?.roomLoader;
  const room = state?.roomFetced;
  const userId = state?.user?._id;
  try {
    socket.on("newMassage", (newMassage) => {
      dispatch(
        success({
          type: "SET_NEW_MASSAGE",
          success: newMassage,
        })
      );
      console.log("all room", allRoom);
      let currentRoom;
      if (!allRoomLoader) {
        currentRoom = allRoom?.room?.find((e) => e?._id === newMassage?.roomId);
      }
      console.log("currentRoom", currentRoom);
      let customCheck;
      if (room._id) {
        customCheck = room._id !== newMassage.roomId; // is room open or not>?
      } else {
        customCheck = true;
      }
      console.log(customCheck, "loooooog");

      // let customCheck;
      // if (room._id) {
      //   customCheck = room._id === newMassage.roomId; // is room open or not>?
      //   if (customCheck) return (customCheck = "nogomore"); //if yes assign customCheck=nogomore
      //   if (customCheck !== "nogomore")
      //     return (customCheck = room._id !== newMassage.roomId);
      // } else {
      //   customCheck = true;
      // }
      // if (customCheck === "nogomore") return;

      if (customCheck == false) return;
      const senderId = currentRoom?.senderId?._id;
      console.log("inside condiotion my id", userId);
      console.log("inside condiotion other id", newMassage.senderId);
      if (userId != senderId) {
        dispatch(hanldeNotification());
        // I'm the sender, so increase receiverUnread
        dispatch(
          success({
            type: "UPDATE_ROOM_UNREAD",
            success: {
              roomId: newMassage.roomId,
              massage: newMassage.massage,
              check: false, // false means "receiverUnread"
            },
          })
        );
      } else {
        dispatch(hanldeNotification());
        // I'm the receiver, so increase senderUnread
        dispatch(
          success({
            type: "UPDATE_ROOM_UNREAD",
            success: {
              roomId: newMassage.roomId,
              massage: newMassage.massage,
              check: true, // true means "senderUnread"
            },
          })
        );
      }
    });
  } catch (error) {
    console.log(error);
  }
};
export const unSubscribeToMassages = () => async (dispatch) => {
  socket.off("newMassage");
};

export const logout = () => async (dispatch) => {
  dispatch(request({ type: "LOGOUT" }));
  try {
    localStorage.clear();
    dispatch(disconnectSocket());
  } catch (error) {
    console.error("Error While LogOut", error);
    throw new Error(error);
  }
};
export const selectroom = (credentials) => async (dispatch) => {
  try {
    socket.emit("unread_massage", credentials);

    dispatch(success({ type: "ROOM_SELECTED_SUCCESS", success: credentials }));
  } catch (error) {
    dispatch(failure({ type: "ROOM_SELECTED_FAILURE", error: error }));

    throw new Error(error);
  }
};
export const getunRead = (credentials) => async (dispatch) => {
  try {
    dispatch(success({ type: "GET_UNREAD_STATE", success: credentials }));
  } catch (error) {
    console.log(error);
  }
};
export const emptyroom = () => async (dispatch) => {
  try {
    dispatch(success({ type: "EMPTY_ROOM_REQUEST" }));
  } catch (error) {
    console.log(error);
  }
};
