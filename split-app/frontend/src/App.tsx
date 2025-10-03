import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import SplashScreen from "./pages/SplashScreen";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupSuccess from "./pages/SignupSuccess";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Wallet from "./pages/Wallet";
import Notifications from "./pages/Notifications";


const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-success" element={<SignupSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#ffffff',
              borderRadius: '1rem',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
            success: {
              duration: 3000,
              style: {
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff',
                border: 'none',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#6366f1',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
              },
              iconTheme: {
                primary: '#ffffff',
                secondary: '#ef4444',
              },
            },
            loading: {
              style: {
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: '#ffffff',
                border: 'none',
              },
            },
          }}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
