import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import appIcon from "../assets/images/AppIcon.svg";

const Verification: React.FC = () => {
  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only store last entered digit
    setCode(newCode);

    // Move to the next input automatically
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Handle OTP Resend
  const handleResend = () => {
    if (!canResend) return;

    setCode(["", "", "", ""]); // Clear input
    setCanResend(false);
    setTimer(60); // Restart timer

    console.log("Resending OTP...");
  };

  // Countdown Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Entered OTP:", code.join(""));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#182338] text-white ">
      {/* Logo */}
      <div className="absolute top-10 left-6 mt-15">
        <img src={appIcon} alt="App Icon" className="w-[80px] h-auto mb-4" />
      </div>

      {/* Verification Box */}
      <div
        className="bg-white rounded-4xl shadow-lg text-center flex flex-col items-center  justify-center mt-40 "
        style={{ width: "339px", height: "254px", top: "262px" }}
      >
        {/* Title with Gray Background */}
        <h2 className="text-lg font-bold bg-gray-500 py-2  w-full rounded-t-4xl text-white">
          Verification Code
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* OTP Input Fields */}
          <div className="flex justify-center text-black gap-3 mt-3">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center text-lg border-b border-gray-500 bg-transparent focus:outline-none focus:border-white "
              />
            ))}
          </div>

          <p className="text-sm text-gray-400">
            Enter the 4-digit code sent via SMS or email.
          </p>
          {/* Verify Button */}
          <div className="flex flex-col items-center justify-center">
            <Button
              text="Verify"
              type="submit"
              className="w-[170px] h-[38px] bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center rounded-full"
            />
          </div>
          {/* Resend Code */}
          <div className="text-center pb-10">
            <p className="text-sm">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`text-pink-400 font-semibold ${
                !canResend ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {canResend ? "Resend Code" : `Resend in ${timer}s`}
            </button>
          </div>

          
        </form>
      </div>

      {/* Go Back Button */}
      <button className="mt-15 bg-pink-600 py-2 px-6 rounded-full flex items-center text-white gap-2">
        <span>&larr;</span> Go back
      </button>
    </div>
  );
};

export default Verification;
