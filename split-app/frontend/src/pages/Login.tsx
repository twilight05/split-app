import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Phone, Lock, Sun, Moon } from "lucide-react";
import { authAPI } from "../components/services/api";
import { useTheme } from "../contexts/ThemeContext";

const Login: React.FC = () => {
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const identifier = isEmailLogin ? email.trim() : phoneNumber.trim();
      
      if (!identifier || !password) {
        toast.error(isEmailLogin ? "Email is required" : "Phone number is required");
        setLoading(false);
        return;
      }

      // Login
      const loginData = await authAPI.login(identifier, password);
      
      if (!loginData.token) {
        throw new Error(loginData.message || "Login failed");
      }

      // Save token and basic user data
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("user", JSON.stringify(loginData.user));

      toast.success("Login successful!");
      
      // Fetch complete profile with wallets
      try {
        const profileData = await authAPI.getProfile();
        localStorage.setItem("userProfile", JSON.stringify(profileData.user));
      } catch (profileError) {
        console.error("Failed to fetch profile:", profileError);
      }

      navigate("/dashboard");

    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-[#182338] via-[#223351] to-[#2a4365]' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all ${
              theme === 'dark'
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white/80 text-gray-700 hover:bg-white shadow-lg'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-2xl font-bold">SA</span>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Split App
          </h1>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your money efficiently
          </p>
        </div>

        {/* Login Form */}
        <div className={`backdrop-blur-lg rounded-2xl p-6 sm:p-8 border transition-all ${
          theme === 'dark'
            ? 'bg-white/10 border-white/20'
            : 'bg-white/80 border-white/40 shadow-xl'
        }`}>
          <h2 className={`text-2xl font-bold text-center mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </h2>

          {/* Login Type Toggle */}
          <div className={`flex rounded-xl p-1 mb-6 ${
            theme === 'dark' ? 'bg-white/10' : 'bg-gray-100'
          }`}>
            <button
              type="button"
              onClick={() => setIsEmailLogin(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all text-sm font-medium ${
                isEmailLogin 
                  ? theme === 'dark'
                    ? "bg-white text-gray-900"
                    : "bg-white text-gray-900 shadow-md"
                  : theme === 'dark'
                    ? "text-white hover:bg-white/10"
                    : "text-gray-600 hover:bg-white/50"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setIsEmailLogin(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-all text-sm font-medium ${
                !isEmailLogin 
                  ? theme === 'dark'
                    ? "bg-white text-gray-900"
                    : "bg-white text-gray-900 shadow-md"
                  : theme === 'dark'
                    ? "text-white hover:bg-white/10"
                    : "text-gray-600 hover:bg-white/50"
              }`}
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email/Phone Input */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-700'
              }`}>
                {isEmailLogin ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  {isEmailLogin ? (
                    <Mail className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Phone className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {isEmailLogin ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      theme === 'dark'
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                        : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                ) : (
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      theme === 'dark'
                        ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                        : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className={`text-sm font-medium ${
                theme === 'dark' ? 'text-white' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    theme === 'dark'
                      ? 'bg-white/10 border-white/20 text-white placeholder-gray-400'
                      : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Don't have an account?{" "}
              <button 
                onClick={() => navigate("/signup")}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Secure • Encrypted • Trusted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;