import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Plus, 
  DollarSign, 
  ArrowUpDown, 
  LogOut, 
  Menu, 
  X, 
  Wallet, 
  TrendingUp, 
  Activity,
  CreditCard,
  Sun,
  Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { authAPI, walletAPI } from "../components/services/api";
import { useTheme } from "../contexts/ThemeContext";

interface User {
  id: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  totalBalance?: number;
  walletCount?: number;
}

interface WalletType {
  id: string;
  name: string;
  isMain: boolean;
  balance: string;
  percentage?: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  amount: string;
  type: string;
  createdAt: string;
}

const walletColors = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-600", 
  "bg-gradient-to-br from-pink-500 to-pink-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-yellow-500 to-yellow-600",
  "bg-gradient-to-br from-red-500 to-red-600",
  "bg-gradient-to-br from-indigo-500 to-indigo-600",
  "bg-gradient-to-br from-orange-500 to-orange-600"
];

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateWallet, setShowCreateWallet] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [splitAmount, setSplitAmount] = useState("");
  const [splitPercentage, setSplitPercentage] = useState("");
  const [splitType, setSplitType] = useState<"amount" | "percentage">("amount");
  const [selectedWallet, setSelectedWallet] = useState("");
  const [transactionFilter, setTransactionFilter] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      const profileData = await authAPI.getProfile();
      setUser(profileData.user);
      
      const walletsData = await walletAPI.getWallets();
      setWallets(walletsData.wallets || []);
      
      if (walletsData.wallets && walletsData.wallets.length > 0) {
        const mainWallet = walletsData.wallets.find((w: WalletType) => w.isMain);
        if (mainWallet) {
          try {
            const transData = await walletAPI.getTransactions(mainWallet.id);
            setTransactions(transData.transactions || []);
          } catch (transError) {
            console.log("No transactions yet");
            setTransactions([]);
          }
        }
      }
      
    } catch (error: any) {
      console.error("Failed to fetch user data:", error);
      if (error.message.includes("Token") || error.message.includes("authorization")) {
        toast.error("Session expired. Please login again.");
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    const newIndex = Math.round(scrollLeft / width);
    setActiveIndex(newIndex);
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim()) {
      toast.error("Wallet name is required");
      return;
    }

    try {
      await walletAPI.createWallet(newWalletName.trim());
      toast.success("Wallet created successfully");
      setNewWalletName("");
      setShowCreateWallet(false);
      fetchUserData();
    } catch (error: any) {
      toast.error(error.message || "Failed to create wallet");
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    
    if (!amount || amount <= 0) {
      toast.error("Valid amount is required");
      return;
    }

    try {
      await walletAPI.deposit(amount);
      toast.success("Deposit successful");
      setDepositAmount("");
      setShowDepositModal(false);
      fetchUserData();
    } catch (error: any) {
      toast.error(error.message || "Failed to deposit");
    }
  };

  const handleSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWallet) {
      toast.error("Please select a wallet");
      return;
    }

    let splitData: { walletId: string; amount?: number; percentage?: number };

    if (splitType === "amount") {
      const amount = parseFloat(splitAmount);
      if (!amount || amount <= 0) {
        toast.error("Valid amount is required");
        return;
      }
      splitData = { walletId: selectedWallet, amount };
    } else {
      const percentage = parseFloat(splitPercentage);
      if (!percentage || percentage <= 0 || percentage > 100) {
        toast.error("Percentage must be between 1 and 100");
        return;
      }
      splitData = { walletId: selectedWallet, percentage };
    }

    try {
      await walletAPI.splitFunds([splitData]);
      toast.success("Funds split successfully");
      setSplitAmount("");
      setSplitPercentage("");
      setSelectedWallet("");
      setShowSplitModal(false);
      fetchUserData();
    } catch (error: any) {
      toast.error(error.message || "Failed to split funds");
    }
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₦${num.toLocaleString()}`;
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'DEPOSIT': return 'Deposit';
      case 'WITHDRAW': return 'Withdrawal';
      case 'SPLIT': return 'Split';
      case 'TRANSFER': return 'Transfer';
      default: return type;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionFilter === "All") return true;
    if (transactionFilter === "Credit") return parseFloat(transaction.amount) > 0;
    if (transactionFilter === "Debit") return parseFloat(transaction.amount) < 0;
    return true;
  });

  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);
  const mainWallet = wallets.find(w => w.isMain);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}>
        <div className={`backdrop-blur-sm rounded-2xl p-8 shadow-2xl border ${
          theme === 'dark'
            ? 'bg-gray-800/80 border-gray-700/20'
            : 'bg-white/80 border-white/20'
        }`}>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className={`text-lg font-medium ${
              theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Loading your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden">
          <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white/95 backdrop-blur-md shadow-2xl border-l border-white/20">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <button className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all group">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Bell className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-900 group-hover:text-blue-700">Notifications</span>
                  <p className="text-sm text-gray-500">3 new updates</p>
                </div>
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-red-50 hover:text-red-700 transition-all group"
              >
                <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div className="text-left">
                  <span className="font-medium text-gray-900 group-hover:text-red-700">Sign Out</span>
                  <p className="text-sm text-gray-500">End your session</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`relative z-10 backdrop-blur-xl border-b sticky top-0 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gray-800/60 border-gray-700/20'
          : 'bg-white/60 border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Welcome Message */}
            <div className="flex items-center">
              <div>
                <p className={`text-lg font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Welcome back, <span className="text-blue-500 font-semibold">{user?.name || 'User'}</span>
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-3 rounded-xl transition-all duration-300 group ${
                    theme === 'dark'
                      ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700/50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs py-1 px-2 rounded-lg whitespace-nowrap ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-900 text-white'
                  }`}>
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </div>
                </button>

                <button className={`relative p-3 rounded-xl transition-all duration-300 group ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                    3
                  </span>
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs py-1 px-2 rounded-lg whitespace-nowrap ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-900 text-white'
                  }`}>
                    New notifications
                  </div>
                </button>
                
                <div className={`h-6 w-px ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 group ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:text-red-400 hover:bg-red-900/30'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className={`lg:hidden p-2 rounded-xl transition-all ${
                theme === 'dark'
                  ? 'text-gray-300 hover:text-blue-400 hover:bg-gray-700/50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Balance Card */}
          <div className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Balance</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatCurrency(totalBalance)}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-700 font-bold text-xs">+2.5%</span>
                </div>
                <span className="text-gray-500 text-xs">vs last month</span>
              </div>
            </div>
          </div>

          {/* Active Wallets Card */}
          <div className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Wallets</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{wallets.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Wallet className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">
                  {wallets.length > 0 ? `${5 - wallets.length} slots remaining` : 'Create your first wallet'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="group relative bg-white/70 backdrop-blur-lg rounded-3xl p-6 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">This Week</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{transactions.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateWallet(true)}
            className="group relative flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={wallets.length >= 5}
          >
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="h-3 w-3" />
            </div>
            <span>Create Wallet</span>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => setShowDepositModal(true)}
            className="group relative flex items-center space-x-3 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/30 transform hover:-translate-y-0.5"
          >
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-3 w-3 text-green-600" />
            </div>
            <span>Deposit Funds</span>
          </button>

          <button
            onClick={() => setShowSplitModal(true)}
            className="group relative flex items-center space-x-3 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!mainWallet || parseFloat(mainWallet.balance) <= 0}
          >
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <ArrowUpDown className="h-3 w-3 text-purple-600" />
            </div>
            <span>Split Funds</span>
          </button>
        </div>

        {/* Wallets Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Wallets</h2>
              <p className="text-gray-600">Manage and monitor your wallet portfolio</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-all">
              View All →
            </button>
          </div>

          {wallets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No wallets yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first wallet. You can create up to 5 wallets to organize your funds.
              </p>
              <button
                onClick={() => setShowCreateWallet(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Wallet</span>
              </button>
            </div>
          ) : (
            <div
              onScroll={handleScroll}
              className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-4 pb-4"
            >
              {wallets.map((wallet, index) => (
                <div
                  key={wallet.id}
                  className={`${walletColors[index % walletColors.length]} snap-center flex-shrink-0 w-72 sm:w-80 h-44 lg:h-48 rounded-2xl p-6 flex flex-col justify-between border border-white/20 backdrop-blur-lg`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-white/80 mb-1">{wallet.name}</p>
                      {wallet.isMain && (
                        <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-medium">
                          Main Wallet
                        </span>
                      )}
                    </div>
                    <Wallet className="w-6 h-6 text-white/60" />
                  </div>
                  <div>
                    <p className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      {formatCurrency(wallet.balance)}
                    </p>
                    <p className="text-xs text-white/60">Available Balance</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Dots */}
          {wallets.length > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {wallets.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Recent Transactions</h2>
              <p className="text-gray-600">Track your financial activity</p>
            </div>
            <div className="flex gap-2">
              {["All", "Credit", "Debit"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTransactionFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    transactionFilter === filter 
                      ? "bg-blue-100 text-blue-700 shadow-sm" 
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.length > 0 ? filteredTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    parseFloat(transaction.amount) > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {parseFloat(transaction.amount) > 0 ? (
                      <TrendingUp className={`h-5 w-5 ${
                        parseFloat(transaction.amount) > 0 ? 'text-green-600' : 'text-red-600'
                      }`} />
                    ) : (
                      <ArrowUpDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{formatTransactionType(transaction.type)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${
                  parseFloat(transaction.amount) > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {parseFloat(transaction.amount) > 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            )) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                <p className="text-gray-500 text-sm">Start by making a deposit to see your transaction history</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Create Wallet Modal */}
      {showCreateWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-200 shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Create New Wallet</h3>
                <p className="text-gray-600">Organize your finances with a custom wallet</p>
              </div>
              <form onSubmit={handleCreateWallet}>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Wallet Name
                    </label>
                    <input
                      type="text"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      placeholder="e.g., Savings, Emergency, Business"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                    >
                      Create Wallet
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateWallet(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md border border-gray-200 shadow-2xl">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Deposit Funds</h3>
                <p className="text-gray-600">Add money to your main wallet</p>
              </div>
              <form onSubmit={handleDeposit}>
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Amount (₦)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="10000"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      Deposit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDepositModal(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Split Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl w-full max-w-md border shadow-2xl ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ArrowUpDown className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Split Funds
                </h3>
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Transfer money from main wallet to another wallet
                </p>
              </div>
              <form onSubmit={handleSplit}>
                <div className="space-y-6">
                  {/* Split Type Toggle */}
                  <div>
                    <label className={`text-sm font-semibold mb-3 block ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Split Method
                    </label>
                    <div className={`flex rounded-xl p-1 ${
                      theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <button
                        type="button"
                        onClick={() => setSplitType("amount")}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all text-sm font-medium ${
                          splitType === "amount"
                            ? theme === 'dark'
                              ? "bg-gray-600 text-white"
                              : "bg-white text-gray-900 shadow-md"
                            : theme === 'dark'
                              ? "text-gray-300 hover:bg-gray-600"
                              : "text-gray-600 hover:bg-white/50"
                        }`}
                      >
                        Fixed Amount
                      </button>
                      <button
                        type="button"
                        onClick={() => setSplitType("percentage")}
                        className={`flex-1 py-2 px-4 rounded-lg transition-all text-sm font-medium ${
                          splitType === "percentage"
                            ? theme === 'dark'
                              ? "bg-gray-600 text-white"
                              : "bg-white text-gray-900 shadow-md"
                            : theme === 'dark'
                              ? "text-gray-300 hover:bg-gray-600"
                              : "text-gray-600 hover:bg-white/50"
                        }`}
                      >
                        Percentage
                      </button>
                    </div>
                  </div>

                  {/* Amount or Percentage Input */}
                  <div>
                    <label className={`text-sm font-semibold mb-3 block ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {splitType === "amount" ? "Amount (₦)" : "Percentage (%)"}
                    </label>
                    {splitType === "amount" ? (
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        max={mainWallet ? parseFloat(mainWallet.balance) : 0}
                        value={splitAmount}
                        onChange={(e) => setSplitAmount(e.target.value)}
                        placeholder="5000"
                        className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                        required
                      />
                    ) : (
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="100"
                        value={splitPercentage}
                        onChange={(e) => setSplitPercentage(e.target.value)}
                        placeholder="25"
                        className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                        }`}
                        required
                      />
                    )}
                    {splitType === "percentage" && mainWallet && (
                      <p className={`text-xs mt-2 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {splitPercentage && `≈ ₦${(parseFloat(mainWallet.balance) * parseFloat(splitPercentage) / 100).toLocaleString()}`}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`text-sm font-semibold mb-3 block ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Transfer to Wallet
                    </label>
                    <select
                      value={selectedWallet}
                      onChange={(e) => setSelectedWallet(e.target.value)}
                      className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-gray-50 border-gray-200 text-gray-900'
                      }`}
                      required
                    >
                      <option value="">Select a wallet</option>
                      {wallets.filter(w => !w.isMain).map(wallet => (
                        <option key={wallet.id} value={wallet.id}>
                          {wallet.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
                    >
                      Split Funds
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSplitModal(false);
                        setSplitAmount("");
                        setSplitPercentage("");
                        setSelectedWallet("");
                      }}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style>
        {`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        `}
      </style>
    </div>
  );
};

export default Dashboard;
