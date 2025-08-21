const initialState = {
  authLoader: false,
  user: JSON.parse(localStorage.getItem("user")) || {},
  roomLoader: false,
  room: {},
  searchUserLoader: false,
  searchUser: {},
  sendReqeustLoader: false,
  sendrequest: {},
  getReqeustLoader: false,
  getrequest: {},
  acceptReqeustLoader: false,
  acceptrequest: {},
  roomFetced: {},
  onlineUsers: [],
  socket: null,
  massages: [],
  istyping: null,
  massageSendLoader: false,
  getmassageLoader: false,
  setgetunreadState: {},
};

export default function reducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case "SIGNUP_REQUEST":
      return {
        ...state,
        authLoader: true,
      };
    case "SIGNUP_SUCCESFULL":
      return {
        ...state,
        authLoader: false,
        user: payload,
      };
    case "SIGNUP_FAILURE":
      return {
        ...state,
        authLoader: false,
      };
    case "LOGIN_REQUEST":
      return {
        ...state,
        authLoader: true,
      };
    case "LOGIN_SUCCESFULL":
      return {
        ...state,
        authLoader: false,
        user: payload,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        authLoader: false,
      };
    case "GET_ROOM_REQUEST":
      return {
        ...state,
        roomLoader: true,
      };
    case "GET_ROOM_SUCCESFULL":
      return {
        ...state,
        roomLoader: false,
        room: payload,
      };
    case "GET_ROOM_FAILURE":
      return {
        ...state,
        roomLoader: false,
      };
    case "GET_SINGLE_USER_REQUEST":
      return {
        ...state,
        searchUserLoader: true,
      };
    case "GET_SINGLE_USER_SUCCESFULL":
      return {
        ...state,
        searchUserLoader: false,
        searchUser: payload,
      };
    case "GET_SINGLE_USER_FAILURE":
      return {
        ...state,
        searchUserLoader: false,
      };

    //SEND REQuEST
    case "SEND_REQUEST_REQUEST":
      return {
        ...state,
        sendReqeustLoader: true,
      };
    case "SEND_REQUEST_SUCCESFULL":
      return {
        ...state,
        sendReqeustLoader: false,
        sendrequest: payload,
      };
    case "SEND_REQUEST_FAILURE":
      return {
        ...state,
        sendReqeustLoader: false,
      };
    //GET ALL REQUEST
    case "GET_ALL_REQUEST_REQUEST":
      return {
        ...state,
        getReqeustLoader: true,
      };
    case "GET_ALL_REQUEST_SUCCESFULL":
      return {
        ...state,
        getReqeustLoader: false,
        getrequest: payload,
      };
    case "GET_ALL_REQUEST_FAILURE":
      return {
        ...state,
        getReqeustLoader: false,
      };
    //Accept  REQUEST
    case "ACCEPT_REQUEST_REQUEST":
      return {
        ...state,
        acceptReqeustLoader: true,
      };
    case "ACCEPT_REQUEST_SUCCESFULL":
      return {
        ...state,
        acceptReqeustLoader: false,
        acceptrequest: payload,
      };
    case "ACCEPT_REQUEST_FAILURE":
      return {
        ...state,
        acceptReqeustLoader: false,
      };
    case "ROOM_SELECTED_SUCCESS":
      return {
        ...state,
        roomFetced: payload,
        massages:
          state.roomFetced._id === payload._id ? [...state.massages] : [],

        room: {
          ...state.room,
          room: state.room?.room?.map((r) =>
            r?._id === payload._id
              ? {
                  ...r,
                  ...(payload.isUserSender
                    ? { senderUnread: 0 }
                    : { receiverUnread: 0 }),
                }
              : r
          ),
        },
      };
    case "ROOM_SELECTED_FAILURE":
      return {
        ...state,
        roomFetced: null,
      };

    case "SOCKET_SET_SUCCESFULL":
      return {
        ...state,
        socket: payload,
      };
    case "GET_ONLINE_USERS":
      return {
        ...state,
        onlineUsers: payload,
      };
    case "SET_NEW_MASSAGE":
      return {
        ...state,
        massages:
          state.roomFetced._id === payload.roomId
            ? [...state.massages, payload]
            : state.massages,
        room: {
          ...state.room,
          room: state.room?.room?.map((r) =>
            r?._id === payload.roomId
              ? {
                  ...r,
                  lastmassage: payload.massage,
                  lastmassagetime: payload.createdAt,
                }
              : r
          ),
        },
      };
    //Send  Massage
    case "SEND_MASSAGE_REQUEST":
      return {
        ...state,
        massageSendLoader: true,
      };
    case "SEND_MASSAGE_SUCCESFULL":
      // const exists = state.massages.find((m) => m._id === payload._id);
      return {
        ...state,
        massageSendLoader: false,
        massages: [...state.massages, payload],
        room: {
          ...state.room,
          room: state.room?.room?.map((r) =>
            r?._id === payload.roomId
              ? {
                  ...r,
                  lastmassage: payload.massage,
                  lastmassagetime: payload.createdAt,
                }
              : r
          ),
        },
      };

    case "SEND_MASSAGE_FAILURE":
      return {
        ...state,
        massageSendLoader: false,
      };
    //Get  Massage
    case "GET_MASSAGES_REQUEST":
      return {
        ...state,
        getmassageLoader: true,
      };

    case "GET_MASSAGES_SUCCESFULL":
      return {
        ...state,
        getmassageLoader: false,
        massages: payload,
      };

    case "GET_MASSAGES_FAILURE":
      return {
        ...state,
        getmassageLoader: false,
      };
    case "IS_TYPING_REQUEST_SUCCESSFULL":
      return {
        ...state,
        istyping: payload,
      };
    case "GET_UNREAD_STATE":
      return {
        ...state,
        setgetunreadState: payload,
      };

    case "UPDATE_ROOM_UNREAD":
      return {
        ...state,
        room: {
          ...state.room,
          room: state.room?.room?.map((r) =>
            r?._id === payload.roomId
              ? {
                  ...r,
                  [payload.check ? "senderUnread" : "receiverUnread"]:
                    (r[payload.check ? "senderUnread" : "receiverUnread"] ||
                      0) + 1,
                  lastmassage: payload.massage,
                  lastmassagetime: new Date().toString(),
                }
              : r
          ),
        },
      };
    case "EMPTY_ROOM_REQUEST":
      return {
        ...state,
        roomFetced: null,
      };
    case "LOGOUT":
      return {
        initialState,
      };

    default:
      return state;
  }
}
