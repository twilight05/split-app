import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Onboarding1 from "../assets/images/amico.svg";
import Onboarding2 from "../assets/images/account card.svg";
import Onboarding3 from "../assets/images/account card (1).svg";
import Onboarding4 from "../assets/images/rafiki.svg";
import Onboarding5 from "../assets/images/pana.svg";

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Welcome to Split",
      subtitle: "Smart Money Management",
      description:
        "Take control of your finances with Split - the ultimate app for splitting expenses, managing budgets, and tracking your money effortlessly.",
      image: Onboarding1,
    },
    {
      title: "Create Multiple Wallets",
      subtitle: "Organize Your Finances",
      description:
        "Set up separate wallets for different purposes - groceries, entertainment, savings, and more. Keep your money organized and your goals clear.",
      image: Onboarding2,
    },
    {
      title: "Split Expenses Easily",
      subtitle: "Share Costs Fairly",
      description:
        "Whether it's dinner with friends or shared household expenses, Split makes it easy to divide costs fairly and keep track of who owes what.",
      image: Onboarding3,
    },
    {
      title: "Track Your Spending",
      subtitle: "Stay on Budget",
      description:
        "Monitor your expenses across all wallets with detailed insights and reports. Know exactly where your money goes and make smarter financial decisions.",
      image: Onboarding4,
    },
    {
      title: "Get Started",
      subtitle: "Your Financial Journey Begins",
      description:
        "Ready to take control of your finances? Create your account and start your journey towards better money management with Split.",
      image: Onboarding5,
    },
  ];

  const nextSlide = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/signup");
    }
  };

  const prevSlide = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const skipOnboarding = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white flex flex-col items-center justify-center p-6">
      {/* Skip Button */}
      <button
        onClick={skipOnboarding}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
      >
        Skip
      </button>

      {/* Image */}
      <div className="flex-1 flex items-center justify-center">
        <img src={slides[step].image} alt="Onboarding" className="w-64 h-64" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md">
        <h1 className="text-3xl font-bold mb-2">{slides[step].title}</h1>
        <h2 className="text-xl text-purple-300 mb-4">{slides[step].subtitle}</h2>
        <p className="text-purple-100 text-lg leading-relaxed mb-8">
          {slides[step].description}
        </p>

        {/* Progress Indicators */}
        <div className="flex space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === step ? "bg-purple-400" : "bg-purple-700/50"
              }`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between w-full">
          <button
            onClick={prevSlide}
            className={`px-6 py-3 rounded-full border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-colors ${
              step === 0 ? "invisible" : ""
            }`}
          >
            Previous
          </button>
          <button
            onClick={nextSlide}
            className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
          >
            {step === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;