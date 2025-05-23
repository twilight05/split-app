import React, { useState } from "react";
import { Bell } from "lucide-react"; // Install: npm install lucide-react

const wallets = [
  { name: "Main Balance", amount: "₦100,000", color: "bg-indigo-600" },
  { name: "Business Wallet", amount: "₦20,000", color: "bg-purple-600" },
  { name: "Savings Wallet", amount: "₦20,000", color: "bg-pink-600" },
  { name: "Expense Wallet", amount: "₦20,000", color: "bg-yellow-500" },
  { name: "Investment Wallet", amount: "₦20,000", color: "bg-green-600" },
  { name: "Emergency Wallet", amount: "₦20,000", color: "bg-red-600" },
];

const Dashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-[#182338] text-white p-4 md:p-6 space-y-8">
      {/* Profile Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <img src="https://via.placeholder.com/40" className="rounded-full w-10 h-10" />
          <div>
            <p className="text-sm text-gray-300">Welcome,</p>
            <p className="font-semibold">User Name</p>
          </div>
        </div>
        <Bell className="w-6 h-6 text-gray-300" />
      </div>

      {/* Wallet Carousel */}
      <div className="relative">
        <div
          onScroll={handleScroll}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory space-x-4 pb-4"
        >
          {wallets.map((wallet, i) => (
            <div
              key={i}
              className={`${wallet.color} snap-center flex-shrink-0 w-full max-w-sm h-40 rounded-2xl p-6 flex flex-col justify-between`}
            >
              <p className="text-sm">{wallet.name}</p>
              <h3 className="text-3xl font-bold">{wallet.amount}</h3>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-2 space-x-2">
          {wallets.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>

      {/* What is 5QM */}
      <div className="bg-[#223351] rounded-xl p-4 flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="font-bold">What is 5QM?</h3>
          <p className="text-gray-400 text-sm">All you need to know →</p>
        </div>
        <img src="https://via.placeholder.com/40" alt="Info" className="w-10 h-10 rounded-full" />
      </div>

      {/* Setup Guide */}
      <div className="space-y-2">
        <h3 className="font-bold text-pink-400">Setup Guide</h3>
        <ul className="list-disc ml-5 text-gray-300 text-sm space-y-1">
          <li>KYC Information</li>
          <li>Fund your account</li>
          <li>Split your balance</li>
        </ul>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <h3 className="font-bold text-pink-400">Recent Transactions</h3>
        <div className="flex space-x-4 text-sm">
          <button className="px-3 py-1 bg-gray-700 rounded-full">All</button>
          <button className="px-3 py-1">Credit</button>
          <button className="px-3 py-1">Debit</button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Theo – Deposit</span>
            <span className="text-green-400">+₦5,000</span>
          </div>
          <div className="flex justify-between">
            <span>Utility – MTN Data</span>
            <span className="text-red-400">-₦2,000</span>
          </div>
          <div className="flex justify-between">
            <span>Referral Bonus</span>
            <span className="text-green-400">+₦3,000</span>
          </div>
        </div>
        <button className="mt-4 w-full text-center py-2 border border-gray-600 rounded-xl text-sm">
          View more
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
