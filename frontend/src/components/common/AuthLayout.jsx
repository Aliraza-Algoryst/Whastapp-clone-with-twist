import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectAuthLoader, selectUser } from "../../selectors/selector";
import { connectSocket, subscribeToMassages } from "../../redux/action";

const AuthLayout = ({ children }) => {
  const user = useSelector(selectUser);
  const authLoader = useSelector(selectAuthLoader);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!authLoader) {
      if (!user?.fullname) {
        navigate("/login");
      }
    }
    if (user?.fullname) {
      dispatch(connectSocket());
    }
    dispatch(subscribeToMassages());
  }, [authLoader, user, navigate, dispatch]);

  return <>{children}</>;
};

export default AuthLayout;
