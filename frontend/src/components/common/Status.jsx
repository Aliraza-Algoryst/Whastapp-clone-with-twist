import React, { useState, useEffect } from "react";
import { images } from "../../assets/images/images";
import { capitalizeWords } from "../../utils/utils";
import { Link } from "react-router";

const ChatCard = ({ name, time, image, setshowview, setopenStatus }) => (
  <div className="flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer">
    <div className="flex items-center">
      <img
        src={image}
        alt={name}
        className="w-12 h-12 rounded-full object-cover mr-3"
      />
      <div>
        <p className="font-medium">{capitalizeWords(name)}</p>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
    </div>
    <Link to="/chat">
      <button
        onClick={() => {
          setshowview(false);
          setopenStatus(false);
        }}
        className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-lg hover:bg-green-600"
      >
        Open Chat
      </button>
    </Link>
  </div>
);

const Status = ({ setopenStatus }) => {
  const [progress, setProgress] = useState(0);
  const [showview, setshowview] = useState(false);

  const viewers = [
    { name: "Ali Raza", time: "5:40 pm", image: images.dummyuserimg },
    { name: "Fatima Khan", time: "5:32 pm", image: images.dummyuserimg },
    { name: "Usman Tariq", time: "5:15 pm", image: images.dummyuserimg },
    { name: "Sana Malik", time: "5:05 pm", image: images.dummyuserimg },
  ];

  useEffect(() => {
    if (!showview) {
      let timer = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            clearInterval(timer);
            setopenStatus(false);
            return 100;
          }
          return p + 1;
        });
      }, 50); // 5 seconds total
      return () => clearInterval(timer);
    }
  }, [showview]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-white/30">
        <div
          className="h-1 bg-green-400 transition-all ease-in-out duration-150"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Header */}
      <div className="absolute top-2 left-0 right-0 flex items-center px-4 py-2 z-10">
        <img
          onClick={() => setopenStatus(false)}
          className="cursor-pointer w-6 h-6 rotate-90 mr-4"
          src={images.dropIcon}
          alt="Back"
        />
        <img
          className="w-10 h-10 rounded-full mr-3"
          src={images.dummyuserimg}
          alt=""
        />
        <div>
          <div className="text-white font-medium">Ali Raza</div>
          <div className="text-xs text-gray-300">Today 5:40 pm</div>
        </div>
      </div>

      {/* Status Image */}
      <div className="flex-grow text-white text-lg flex items-center justify-center">
        {/* <img
          src="https://via.placeholder.com/600x800"
          alt="status"
          className="max-h-full max-w-full object-contain"
        /> */}
        This is The Status Bro
      </div>

      {/* Footer */}
      <div className="relative p-4 bg-black/50">
        <div
          onClick={() => setshowview(!showview)}
          className="cursor-pointer flex flex-col items-center"
        >
          <svg
            className="w-5 rotate-180 mb-1"
            fill="#ffffff"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L6.29289 9.70711C5.90237 9.31658 5.90237 8.68342 6.29289 8.29289C6.68342 7.90237 7.31658 7.90237 7.70711 8.29289L12 12.5858L16.2929 8.29289C16.6834 7.90237 17.3166 7.90237 17.7071 8.29289C18.0976 8.68342 18.0976 9.31658 17.7071 9.70711L12.7071 14.7071Z"
            />
          </svg>
          <div className="text-sm text-white">{viewers.length} Views</div>
        </div>

        {/* Bottom Sheet Viewers */}
        <div
          className={`absolute left-0 w-full bg-white rounded-t-xl transition-transform duration-300 ${
            showview ? "translate-y-0" : "translate-y-full"
          } bottom-0`}
        >
          <div className="p-2 border-b text-gray-500 text-sm">Viewed by</div>
          {viewers.map((viewer, index) => (
            <ChatCard
              key={index}
              setopenStatus={setopenStatus}
              setshowview={setshowview}
              name={viewer.name}
              time={viewer.time}
              image={viewer.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Status;
