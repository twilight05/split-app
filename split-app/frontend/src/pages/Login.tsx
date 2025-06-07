import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import appIcon from "../assets/images/AppIcon.svg";
import fingerprint from "../assets/images/fingerprint.svg";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
const [password, setPassword] = useState("");



  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
            // on success, send user to dashboard
            navigate("/dashboard");
          }, 1500);
      
  };

  return (
    <div className="h-screen flex flex-col bg-[#182338] text-white p-6 overflow-hidden">
      {/* Logo + Welcome Text */}
      <div className="pl-6 pt-6 flex flex-col place-items-start">
        <img
          src={appIcon}
          alt="App Icon"
          className="w-[80px] h-auto mb-4 pt-10"
        />
        <h2 className="text-4xl font-bold mt-8">Welcome Back</h2>
        <p className="text-lg mt-2 mb-10">Sign in to continue</p>
      </div>

      {/* Login Box */}
      <div className="flex flex-col items-center justify-center w-full">
        <form
          className="w-full max-w-xs flex flex-col gap-4"
          onSubmit={handleLogin}
        >
          {/* Animate Email / Phone Switch */}
          <AnimatePresence mode="wait">
            {isEmailLogin ? (
              <motion.input
                key="email"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                type="email"
                placeholder="someone1234@gmail.com"
                className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-white text-center"
              />
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between border-b border-gray-500 py-2"
              >
                <span className="text-gray-400">+234</span>
                <input
                  type="tel"
                  placeholder="903 401 2507"
                  className="w-full bg-transparent focus:outline-none text-center"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Switch Login Method */}
          <p
            className="text-sm text-pink-400 cursor-pointer text-left"
            onClick={() => setIsEmailLogin(!isEmailLogin)}
          >
            Sign in with {isEmailLogin ? "phone number" : "email"} instead
          </p>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="********"
              className="w-full bg-transparent border-b border-gray-500 py-2 focus:outline-none focus:border-white text-center"
            />
            <div
              className="absolute right-2 top-2 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </div>
          </div>

          {/* Forgot Password */}
          <p className="text-sm text-pink-400 cursor-pointer text-right">
            Forgot Password?
          </p>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 py-2 rounded-full mt-2 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <FaSpinner className="animate-spin text-white text-lg" />
            ) : (
              "Log in"
            )}
          </button>
        </form>
      </div>

      {/* Biometric & Signup */}
      <div className="mt-10 text-center">
        <img
          src={fingerprint}
          alt="Biometric"
          className="mx-auto w-12 h-12 mb-2"
        />
        <p className="text-sm">Use Biometrics</p>
        <p className="text-sm mt-4">
          Don't have an account?{" "}
          <span className="text-pink-400 cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
