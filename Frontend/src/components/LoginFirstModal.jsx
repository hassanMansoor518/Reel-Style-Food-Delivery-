import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginFirstModal() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fff7f3] backdrop-blur-md p-4">
      <div className="bg-white border border-[#f6d7c8] text-gray-900 w-full max-w-xs p-6 rounded-2xl shadow-xl flex flex-col items-center">

        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="orange"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-semibold mb-2 text-center">Please Login First</h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          To access this page and view the best restaurants near you, please
          login to your account.
        </p>

        <button
          onClick={() => navigate("/user/login")}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 transition rounded-xl text-white font-medium flex items-center justify-center gap-2"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/user/register")}
          className="mt-4 text-gray-600 hover:text-gray-800 text-sm"
        >
          Create an account
        </button>

        <button className="mt-3 text-xs text-gray-400 hover:text-gray-600">
          Back to Welcome
        </button>
      </div>
    </div>
  );
}

