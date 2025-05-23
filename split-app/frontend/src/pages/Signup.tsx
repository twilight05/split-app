import React, { useState } from "react";
import Button from "../components/Button";
import appIcon from "../assets/images/AppIcon.svg";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

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
    setIsLoading(true); // Start loading immediately
  
    try {
      console.log("Signup Data:", formData);
  
      // 👉 simulate signup process (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 1500)); // simulate 1.5s delay
  
      toast.success("Signup successful! 🎉");
      setIsLoading(false);
  
      navigate("/signup-success");
    } catch (error) {
      console.error(error);
      toast.error("Signup failed. Try again.");
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
        </div>
        {/* Signup Form */}
        <div className="flex justify-center items-center flex-grow">

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-10">
          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="someone1234@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-b text-white bg-transparent py-2 border-gray-600 focus:outline-none focus:border-white"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="flex items-center border-b border-gray-600">
            <PhoneInput
              country={"ng"}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              inputClass="w-full bg-transparent text-white focus:outline-none py-2"
              containerClass="w-full"
              buttonClass="bg-transparent border-none"
            />
          </div>

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

          {/* Signup Button */}
          <Button
  text={isLoading ? "Loading..." : "Verify"}
  type="submit"
  disabled={isLoading}
  className="mt-6 w-full bg-pink-500 text-white text-lg py-3 hover:bg-pink-600 rounded-full"
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
