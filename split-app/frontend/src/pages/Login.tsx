import React, { useState } from "react";
import Button from "../components/Button";
import appIcon from "../assets/images/AppIcon.svg";
import fingerprint from "../assets/images/fingerprint.svg";

const Login = () => {
  const [isEmailLogin, setIsEmailLogin] = useState(false);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#182338] text-white overflow-hidden px-6">
      {/* Logo */}
      <div className="absolute top-10 left-6">
        <img src={appIcon} alt="App Icon" className="w-[80px] h-auto" />
      </div>

      {/* Login Box */}
      <div className="p-6 rounded-lg  w-full max-w-xs text-center">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-sm text-gray-400 mb-6">Sign in to continue</p>

        {/* Input Fields */}
        <form className="relative w-full max-w-xs text-center h-[100px] flex flex-col justify-center
">
          {isEmailLogin ? (
            <input
              type="email"
              placeholder="someone1234@gmail.com"
              className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-white text-center"
            />
          ) : (
            <div className="flex items-center justify-between border-b border-gray-500 py-2">
              <span className="text-gray-400">+234</span>
              <input
                type="tel"
                placeholder="903 401 2507"
                className="w-full bg-transparent focus:outline-none text-center"
              />
            </div>
            
          )}
           <p
            className="text-sm text-pink-400 cursor-pointer text-left"
            onClick={() => setIsEmailLogin(!isEmailLogin)}
          >
            Sign in with {isEmailLogin ? "phone number" : "email"} instead
          </p>

          <input
            type="password"
            placeholder="********"
            className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-white text-center"
          />

          {/* Switch Login Method */}
         

          <p className="text-sm text-pink-400 cursor-pointer text-right">Forgot Password?</p>

          {/* Login Button */}
          <Button
            text="Log in"
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 py-2 rounded-full mt-4"
          />
        </form>
      </div>

      {/* Biometric & Signup */}
      <div className="mt-6 text-center">
      <img src={fingerprint} alt="Biometric" className="mx-auto w-12 h-12 mb-2" />
        
        <p className="text-sm">Use Biometrics</p>
        <p className="text-sm mt-4">
          Don't have an account? <span className="text-pink-400 cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
