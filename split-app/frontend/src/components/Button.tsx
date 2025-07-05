import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean; // 👉 Add this to props
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "button",
  className,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled} // 👉 Pass disabled
      className={`w-[170px] h-[38px] bg-pink-500 hover:bg-pink-600 rounded-[39px] 
             px-[62px] py-[9px] text-center transition ${
               disabled ? "opacity-50 cursor-not-allowed" : ""
             } ${className}`} // 👉 Corrected className usage
    >
      {text}
    </button>
  );
};

export default Button;
