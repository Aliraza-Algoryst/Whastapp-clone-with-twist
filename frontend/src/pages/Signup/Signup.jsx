import React, { useEffect } from "react";
import SignupScreen from "../../components/screens/SignupScreen/SignupScreen";
import * as yup from "yup";
import { useFormik } from "formik";
import { register } from "../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { selectUser } from "../../selectors/selector";
import { failure, success } from "../../utils/toastutils";
const Signup = () => {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.fullname) {
      navigate("/");
    }
  }, [user, navigate]);

  const signupValidation = yup.object({
    fullname: yup.string().required("Fullname is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(4).max(10).required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { fullname: "", email: "", password: "" },
    validationSchema: signupValidation,
    onSubmit: async () => {
      try {
        await dispatch(register(formik.values));
        success("Register Successfully");
        navigate("/"); // ✅ only runs if no error thrown
      } catch (error) {
        failure("Signup failed");
      }
    },
  });
  return (
    <div>
      <SignupScreen formik={formik} />
    </div>
  );
};

export default Signup;
