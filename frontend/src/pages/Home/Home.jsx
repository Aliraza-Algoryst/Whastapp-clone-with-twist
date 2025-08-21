import React from "react";
import { Outlet, useLocation } from "react-router";
import SidebarScreen from "../../components/screens/SidebarScreen";
import { selectSocket, selectUser } from "../../selectors/selector";
import { success } from "../../redux/builder";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { emptyroom, socket } from "../../redux/action";

const Home = () => {
  const { pathname } = useLocation();
  const socketdata = useSelector(selectSocket);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!socketdata) return;

    // if (pathname === "/") {
    //   dispatch(emptyroom());
    // }
    // Listen for rooms once
    socket.on("get_rooms", (room) => {
      dispatch(success({ type: "GET_ROOM_SUCCESFULL", success: room }));
    });

    if (user._id) {
      socket.emit("request_rooms", user._id); // send as object
    }

    console.log("user is typing useffect ");
    socket.on("is_typing", (backendresponse) => {
      console.log("user is typing");
      dispatch(
        success({
          type: "IS_TYPING_REQUEST_SUCCESSFULL",
          success: backendresponse,
        })
      );
    });
  }, [socketdata]);

  return (
    <div className="h-[100lvh] overflow-hidden grid grid-cols-12">
      {/* Sidebar */}
      <div
        className={`sm:col-span-6  md:col-span-5 lg:col-span-3 col-span-12  ${
          pathname === "/chat" && "max-sm:hidden"
        }`}
      >
        <SidebarScreen />
      </div>

      {/* Chat/Outlet section */}
      <div
        className={`lg:col-span-9 sm:col-span-6  md:col-span-7 bg-[#F1F4F799] col-span-12 w-full h-full overflow-y-auto no-scrollbar ${
          pathname === "/" && "max-sm:hidden"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
