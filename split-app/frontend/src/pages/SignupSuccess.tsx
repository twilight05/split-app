import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import successIcon from "../assets/images/successIcon.svg";

const SignupSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#182338] text-white p-6">
      {/* Success Icon */}
      <img
        src={successIcon}
        alt="Success"
        className="w-32 h-32 mb-8 animate-bounce"
      />

      {/* Success Text */}
      <h2 className="text-3xl font-bold mb-4">Account Created!</h2>
      <p className="text-lg text-gray-400 mb-10 text-center">
        Your account has been successfully created.
      </p>

      {/* Go to Login Button */}
      <Button
        text="Go to Login"
        type="button"
        className="w-56 bg-pink-500 hover:bg-pink-600 py-3 rounded-full flex items-center justify-center" 
        onClick={() => navigate("/login")}
      />
    </div>
  );
};

export default SignupSuccess;
