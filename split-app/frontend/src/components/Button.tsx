import React from "react";
interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`className="w-[170px] h-[38px] bg-pink-500 hover:bg-pink-600 rounded-[39px] 
             px-[62px] py-[9px] text-center" transition ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
