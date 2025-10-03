import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Mail, Phone, Lock, User, Sun, Moon } from "lucide-react";
import { authAPI } from "../components/services/api";
import { useTheme } from "../contexts/ThemeContext";

const Signup: React.FC = () => {
  const [isEmailSignup, setIsEmailSignup] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme, themeClasses, spacing, buttons, cn } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, email, phoneNumber, password, confirmPassword } = formData;
      
      // Validation
      if (!name.trim()) {
        toast.error("Name is required");
        setLoading(false);
        return;
      }

      const identifier = isEmailSignup ? email.trim() : phoneNumber.trim();
      if (!identifier) {
        toast.error(isEmailSignup ? "Email is required" : "Phone number is required");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }

      // Signup
      const signupData = await authAPI.signup(
        name.trim(),
        password,
        isEmailSignup ? email.trim() : undefined,
        isEmailSignup ? undefined : phoneNumber.trim()
      );
      
      // Check if signup was successful
      if (signupData.message === "User created" && signupData.userId) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        throw new Error(signupData.message || "Signup failed");
      }

    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center transition-colors duration-300 px-4 py-4',
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-800' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-violet-50'
    )}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4 sm:mb-6">
          <button
            onClick={toggleTheme}
            className={cn(
              'p-3 rounded-2xl transition-all duration-300',
              theme === 'dark'
                ? 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
                : 'bg-white/80 backdrop-blur-sm border border-indigo-100 text-slate-600 hover:bg-white hover:text-indigo-600 shadow-sm'
            )}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Signup Form */}
        <div className={cn(
          'backdrop-blur-xl rounded-3xl transition-all duration-300',
          spacing.modal.padding,
          theme === 'dark'
            ? 'bg-slate-800/40 border border-slate-700/50 shadow-2xl shadow-black/20'
            : 'bg-white/70 border border-white/20 shadow-2xl shadow-indigo-500/10'
        )}>
          <h2 className={cn(
            'text-2xl font-bold text-center mb-8',
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          )}>
            Create Account
          </h2>

          {/* Signup Type Toggle */}
          <div className={cn(
            'flex rounded-2xl p-1 mb-8',
            theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100/80'
          )}>
            <button
              type="button"
              onClick={() => setIsEmailSignup(true)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all text-sm font-medium',
                isEmailSignup 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : cn(
                      theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-600/50' : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
                    )
              )}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => setIsEmailSignup(false)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all text-sm font-medium',
                !isEmailSignup 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : cn(
                      theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-600/50' : 'text-slate-600 hover:text-indigo-600 hover:bg-white/50'
                    )
              )}
            >
              <Phone className="w-4 h-4" />
              Phone
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label className={cn(
                'text-sm font-semibold block',
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              )}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <User className={cn('w-5 h-5', themeClasses.text.muted)} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={cn(
                    'w-full pl-12 pr-4 py-4 border rounded-2xl transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:bg-slate-800/70'
                      : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white'
                  )}
                  required
                />
              </div>
            </div>

            {/* Email/Phone Input */}
            <div className="space-y-2">
              <label className={cn(
                'text-sm font-semibold block',
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              )}>
                {isEmailSignup ? "Email Address" : "Phone Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  {isEmailSignup ? (
                    <Mail className={cn('w-5 h-5', themeClasses.text.muted)} />
                  ) : (
                    <Phone className={cn('w-5 h-5', themeClasses.text.muted)} />
                  )}
                </div>
                {isEmailSignup ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={cn(
                      'w-full pl-12 pr-4 py-4 border rounded-2xl transition-all duration-300',
                      'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:bg-slate-800/70'
                        : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white'
                    )}
                    required
                  />
                ) : (
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={cn(
                      'w-full pl-12 pr-4 py-4 border rounded-2xl transition-all duration-300',
                      'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                      theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:bg-slate-800/70'
                        : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white'
                    )}
                    required
                  />
                )}
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className={cn(
                'text-sm font-semibold block',
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              )}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <Lock className={cn('w-5 h-5', themeClasses.text.muted)} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={cn(
                    'w-full pl-12 pr-14 py-4 border rounded-2xl transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:bg-slate-800/70'
                      : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'absolute inset-y-0 right-0 pr-4 flex items-center transition-colors',
                    themeClasses.text.muted,
                    'hover:text-primary-600 dark:hover:text-primary-400'
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className={cn(
                'text-sm font-semibold block',
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              )}>
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                  <Lock className={cn('w-5 h-5', themeClasses.text.muted)} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={cn(
                    'w-full pl-12 pr-14 py-4 border rounded-2xl transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500',
                    theme === 'dark'
                      ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:bg-slate-800/70'
                      : 'bg-white/90 border-slate-300 text-slate-900 placeholder-slate-500 focus:bg-white'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={cn(
                    'absolute inset-y-0 right-0 pr-4 flex items-center transition-colors',
                    themeClasses.text.muted,
                    'hover:text-primary-600 dark:hover:text-primary-400'
                  )}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full py-4 px-6 rounded-2xl font-semibold transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  buttons.primary
                )}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
            )}>
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/login")}
                className={cn(
                  'font-semibold transition-colors',
                  theme === 'dark' 
                    ? 'text-indigo-400 hover:text-indigo-300' 
                    : 'text-indigo-600 hover:text-indigo-700'
                )}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className={cn(
            'text-xs',
            theme === 'dark' ? 'text-slate-500' : 'text-slate-500'
          )}>
            Secure • Encrypted • Trusted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;