import { useState } from "react";
import Onboarding1 from "../assets/images/amico.svg";
import Onboarding2 from "../assets/images/account card.svg";
import Expense from "../assets/images/account card (1).svg";
import Savings from "../assets/images/account card (2).svg";
import Deposit from "../assets/images/account card (3).svg";
import Emergency from "../assets/images/account card (4).svg";
import Investment from "../assets/images/account card (5).svg";
import Onboarding4 from "../assets/images/rafiki.svg";
import Onboarding5 from "../assets/images/pana.svg";

const Onboarding = () => {
    const [step, setStep] = useState(0);
  
    const nextStep = () => {
      if (step < 4) setStep(step + 1);
    };
  
    const slides = [
      // Slide 1
      {
        image: Onboarding1,
        text: "Welcome to Banking Reimagined",
        button: "Next",
      },
      // Slide 2
      {
        image: Onboarding2,
        text: "One Account...",
        button: "Next",
      },
      // Slide 3 (Special Grid Layout)
      {
        content: (
          <div className="grid grid-rows-3 grid-cols-2 gap-4 w-full max-w-xs">
            <img src={Expense} alt="Expense" className="w-20 h-20 mx-auto" />
            <img src={Savings} alt="Savings" className="w-20 h-20 mx-auto" />
            <div className="col-span-2 flex justify-center">
              <img src={Deposit} alt="Deposit" className="w-24 h-24" />
            </div>
            <img src={Emergency} alt="Emergency" className="w-20 h-20 mx-auto" />
            <img src={Investment} alt="Investment" className="w-20 h-20 mx-auto" />
          </div>
        ),
        text: "...that splits into 5",
        button: "Next",
      },
      // Slide 4
      {
        image: Onboarding4,
        text: "Enjoy up to 15% interests on investments",
        button: "Next",
      },
      // Slide 5
      {
        image: Onboarding5,
        text: "Enjoy the support of an active community",
        button: "Let's Go",
      },
    ];
  
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#223351] text-white text-center p-6">
        {/* Image or Special Layout */}
        {slides[step].image ? (
          <img src={slides[step].image} alt="Onboarding" className="w-64 h-64" />
        ) : (
          slides[step].content
        )}
  
        {/* Text */}
        <p className="mt-6 text-lg">{slides[step].text}</p>
  
        {/* Progress Dots */}
        <div className="flex mt-4 space-x-2">
          {slides.map((_, index) => (
            <div
            key={index}
            className={`w-[30px] h-[5px] rounded-[28px] ${
              step === index ? "bg-pink-500" : "bg-gray-500"
            }`}
          />
          ))}
        </div>
  
        {/* Next Button */}
        <button
        onClick={nextStep}
        className="mt-6 bg-pink-500 text-white rounded-[39px] px-[62px] py-[9px] text-lg flex items-center justify-center min-w-[161px] h-[38px] whitespace-nowrap"
        style={{ width: "161px", height: "38px", gap: "10px" }}
      >
          {slides[step].button}
        </button>
      </div>
    );
  };
  
  export default Onboarding;



