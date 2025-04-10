



import React, { useState, useEffect } from "react";
// import SplashScreen from "./components/SplashScreen";
// import Onboarding from "./components/Onboarding";
// import Signup from "./pages/Signup";
// import Verification from "./pages/Verification";
import Login from "./pages/Login";

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Simulate a delay (SplashScreen will be shown for 7 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // After 7 seconds, switch to onboarding screen
    }, 7000);
    return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
  }, []);

  return (
    <div className="App">
      {/* Show SplashScreen for 7 seconds, then switch to Onboarding */}
      {/* {showSplash ? <SplashScreen /> : <Onboarding />} */}
      {/* <Signup /> */}
      {/* <Verification /> */}
      <Login />
       
     
    </div>
  );
};

export default App;
