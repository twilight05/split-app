
import '../styles/SplashScreen.css'; 
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/onboarding"); // move to onboarding after 5 sec
    }, 5000);
  }, [navigate]);
  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 flex flex-col justify-center items-center">
      {/* App Name with animation */}
      <div className="pulse-animation">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-4 tracking-wider">
          Split
        </h1>
        <p className="text-xl text-purple-200 text-center font-light">
          Smart Money Management
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
