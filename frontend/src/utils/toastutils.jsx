// utils/toastUtils.js
import { toast } from "react-hot-toast";

// Generic Success Toast
export const success = (message = "Liked successfully!") => {
  toast.success(message, {
    duration: 3000,
    position: "top-center",
    style: {
      border: "1px solid #4ade80",
      padding: "8px 16px",
      color: "#166534",
    },
    iconTheme: {
      primary: "#4ade80",
      secondary: "#f0fdf4",
    },
  });
};

// Play sound helper
const playNotificationSound = (soundPath = "/sounds/successss.mp3") => {
  const audio = new Audio(soundPath);
  audio.play().catch((err) => console.warn("Sound play error:", err));
};

// Generic Success Toast with sound, gradient, image
export const successs = (message = "Liked successfully!") => {
  playNotificationSound();

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } relative max-w-sm w-full bg-white shadow-xl rounded-xl overflow-hidden pointer-events-auto flex items-center`}
        style={{
          borderLeft: "6px solid #10B981", // Emerald green accent
        }}
      >
        {/* Animated gradient bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 animate-pulse"></div>

        {/* Icon area */}
        <div className="flex-shrink-0 bg-green-100 p-3 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Message area */}
        <div className="flex-1 px-4 py-3">
          <p className="text-gray-800 font-semibold">{message}</p>
          <p className="text-xs text-gray-500">Just now</p>
        </div>

        {/* Close button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
        >
          ✕
        </button>
      </div>
    ),
    {
      position: "top-right",
      duration: 3000,
    }
  );
};

// Generic Error Toast (can also have sound if you want)
export const failureee = (message = "Please try again later") => {
  playNotificationSound("/sounds/error.mp3"); // Use different sound for error

  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full bg-gradient-to-bl from-red-400 to-pink-500 shadow-lg rounded-lg pointer-events-auto flex items-center p-4`}
      >
        {/* <img
          src="/images/error-icon.png"
          alt="error"
          className="w-10 h-10 rounded-full mr-3"
        /> */}
        <div className="flex-1">
          <p className="text-white font-semibold">{message}</p>
        </div>
      </div>
    ),
    {
      position: "top-right",
      duration: 3000,
    }
  );
};

// Generic Error Toast
export const failure = (message = "Please try again later") => {
  toast.error(message, {
    duration: 3000,
    position: "top-center",
    style: {
      border: "1px solid #f87171",
      padding: "8px 16px",
      color: "#7f1d1d",
    },
    iconTheme: {
      primary: "#f87171",
      secondary: "#fef2f2",
    },
  });
};
