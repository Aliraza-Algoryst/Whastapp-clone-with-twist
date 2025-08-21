import React from "react";
import { images } from "../../../assets/images/images";
import { Link, useNavigate } from "react-router";

const SignupScreen = ({ formik }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-12 h-lvh">
      <div className="max-sm:col-span-12 col-span-6">
        <div className="flex justify-start gap-3 m-5">
          <img
            onClick={() => {
              navigate(-1);
            }}
            className="cursor-pointer rotate-90"
            src={images.dropIcon}
            alt="Back icon"
          />
          <div className="text-lg text-gray-400 font-medium">Back</div>
        </div>
        <div className="flex justify-center items-center mx-auto h-dvh max-sm:mx-4 sm:w-[425px]">
          <form
            onSubmit={formik.handleSubmit}
            className="flex-col space-y-5 w-full"
          >
            <div className="text-[30px] font-medium">Account Signup</div>
            <div className="text-gray-400">
              Easily create your account from this page
            </div>

            <div className="text-gray-500">Full Name</div>
            <input
              name="fullname"
              type="text"
              placeholder="Enter Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullname}
              className="p-3 border rounded-md border-gray-300 outline-none w-full"
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <div className="text-red-500">{formik.errors.fullname}</div>
            )}
            <div className="text-gray-500">Email address</div>
            <input
              name="email"
              type="email"
              placeholder="Enter Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="p-3 border rounded-md border-gray-300 outline-none w-full"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500">{formik.errors.email}</div>
            )}

            <div className="text-gray-500">Password</div>
            <input
              name="password"
              type="text"
              placeholder="Enter Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="p-3 border rounded-md border-gray-300 outline-none w-full"
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500">{formik.errors.password}</div>
            )}

            <button
              type="submit"
              className="text-center bg-green-400 cursor-pointer text-black w-full rounded-md py-3"
            >
              Register Account
            </button>

            <div className="text-center text-gray-500">
              Don’t have an account?
              <Link to="/login">
                <span className="text-blue-500 font-medium"> Login</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
      <div className="max-sm:hidden col-span-6 bgimage flex justify-center items-center">
        <img src={images.whatsapp} alt="WhatsApp logo" />
      </div>
    </div>
  );
};

export default SignupScreen;
