import React, { useState } from "react";
import Button from "../components/Button";
import appIcon from "../assets/images/AppIcon.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { motion, AnimatePresence } from "framer-motion";

import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "", // Added name field
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [isEmail, setIsEmail] = useState(true); 

  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Phone Number Change
  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phoneNumber: value });
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); 
    
    const { name, email, phoneNumber, password, confirmPassword } = formData;
    
    // Validation
    if (!name.trim()) {
      toast.error("Name is required.");
      setIsLoading(false);
      return;
    }

    if (isEmail && !email.trim()) {
      toast.error("Email is required.");
      setIsLoading(false);
      return;
    }

    if (!isEmail && !phoneNumber.trim()) {
      toast.error("Phone number is required.");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }
  
    try {
      // Prepare request body
      const requestBody: any = {
        name: name.trim(),
        password,
      };

      // Add either email or phone number
      if (isEmail) {
        requestBody.email = email.trim();
      } else {
        requestBody.phoneNumber = phoneNumber.trim();
      }

      console.log("Sending signup request:", requestBody);

      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Signup successful!");
      navigate("/signup-success");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#182338] text-white p-6">

      <div className="pl-6 pt-6 flex flex-col place-items-start">
        <img
          src={appIcon}
          alt="App Icon" className="w-[80px] h-auto mb-4 pt-10"
          
        />
        
        <h2 className="text-4xl font-bold mt-10">Welcome</h2>
        <p className="text-lg mt-4">Complete your setup</p>
        <p className="mb-6">Sign up with {isEmail ? "Email" : "Phone Number"}</p>

      </div>
      {/* Signup Form */}
      <div className="flex justify-center items-center flex-grow">

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-10">

          {/* Name Field - ADDED */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-white text-center"
            required
          />

          <AnimatePresence mode="wait">
            {isEmail ? (
              <motion.input
                key="email"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                type="email"
                placeholder="someone1234@gmail.com"
                value={formData.email}
                name="email"
                onChange={handleChange}
                className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-white text-center"
              />
            ) : (
              <motion.input
                key="phone"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                type="tel"
                placeholder="903 401 2507"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-white text-center"
              />
            )}
          </AnimatePresence>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-b text-white bg-transparent py-2 border-gray-600 focus:outline-none focus:border-white"
              required
            />
            {/* Eye Icon */}
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border-b text-white bg-transparent py-2 border-gray-600 focus:outline-none focus:border-white"
              required
            />
            {/* Eye Icon */}
            <div
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          {/* Toggle Email/Phone */}
          <p
            className="text-sm text-pink-400 cursor-pointer"
            onClick={() => setIsEmail(!isEmail)}
          >
            {isEmail
              ? "Sign up with Phone instead"
              : "Sign up with Email instead"}
          </p>

          <Button
            text={isLoading ? "Loading ..." : "Sign Up"}
            type="submit"
            disabled={isLoading}
            className= "mt-6 w-full bg-pink-500 text-white text-lg py-3 hover:bg-pink-600 rounded-full"
          />

        </form>
      </div>

      {/* Already have an account? */}
      <div className="flex flex-col items-center mt-6">
        <p className="mt-4 text-sm">
          Already have an account?{" "}</p>
        <p> <a href="/login" className="text-pink-400 ">
          Log in
        </a></p>
      </div>

    </div>
  );
};

export default Signup;