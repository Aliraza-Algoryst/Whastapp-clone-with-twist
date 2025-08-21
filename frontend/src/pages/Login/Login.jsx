import React, { useEffect } from "react";
import LoginScreen from "../../components/screens/Login/LoginScreen";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../selectors/selector";
import { useNavigate } from "react-router";
import { login } from "../../redux/action";
import { failure, success } from "../../utils/toastutils";
const Login = () => {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.fullname) {
      navigate("/");
    }
  }, [user, navigate]);

  const loginValidation = yup.object({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required").min(3).max(10),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginValidation,
    onSubmit: async () => {
      try {
        await dispatch(login(formik.values));
        success("Login Succesfull");
        navigate("/");
      } catch (error) {
        failure(
          typeof error === "string" ? error : error.message || "Unknown error"
        );
      }
    },
  });
  return (
    <div>
      <LoginScreen formik={formik} />
    </div>
  );
};

export default Login;
