import React from 'react';
import appIcon from '../assets/images/AppIcon.svg';
import '../styles/SplashScreen.css'; // Import the CSS file

const SplashScreen: React.FC = () => {
  return (
    <div className="h-screen bg-[#182338] flex justify-center items-center">
      {/* Apply the animation class to the img */}
      <img src={appIcon} alt="App Icon" className="w-32 h-32 pulse-animation" />
    </div>
  );
};

export default SplashScreen;
