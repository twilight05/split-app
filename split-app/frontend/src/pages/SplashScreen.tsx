
import appIcon from '../assets/images/AppIcon.svg';
import '../styles/SplashScreen.css'; 
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/onboarding"); // move to onboarding after 3 sec
    }, 5000);
  }, [navigate]);
  return (
    <div className="h-screen bg-[#182338] flex justify-center items-center">
      {/* Apply the animation class to the img */}
      <img src={appIcon} alt="App Icon" className="w-32 h-32 pulse-animation" />
    </div>
  );
};

export default SplashScreen;
