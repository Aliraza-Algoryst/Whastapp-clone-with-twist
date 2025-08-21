import React from "react";
import { images } from "../../../assets/images/images";
import { Link } from "react-router";

const ProfileScreen = ({user}) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-green-300/30 dark:bg-[#1E1E1E] rounded-xl  shadow-md p-6">
     
     <Link to={"/"}> <div className="flex items-center gap-2"> <img className="rotate-90" src={images.dropIcon} alt="" /><div>Back</div></div>
      </Link>{/* Profile Image */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <img
            src={user?.profilepic}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-2 border-green-300"
          />
          <label
            htmlFor="profilePic"
            className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 p-1 rounded-full cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 5h-3.2l-1.7-2h-6.2l-1.7 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM12 17c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
              <circle cx="12" cy="13" r="2.5" />
            </svg>

            <input id="profilePic" type="file" className="hidden" />
          </label>
        </div>

        {/* Name Field */}
        <div className="w-full">
          <label className="text-sm text-gray-600 dark:text-gray-400">
           {user?.fullname}
          </label>
          <input
            type="text"
            className="mt-1 w-full p-2 rounded-md border dark:bg-[#2A2A2A] border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter your name"
            defaultValue= {user?.fullname}
          />
        </div>

        {/* About Field */}
        <div className="w-full mt-3">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            {user?.bio}
          </label>
          <textarea
            rows={2}
            className="mt-1 w-full p-2 rounded-md border dark:bg-[#2A2A2A] border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Hey there! I am using WhatsApp."
          ></textarea>
        </div>

        {/* Save Button */}
        <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-md">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
