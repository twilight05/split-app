import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  Plus, 
  Banknote, 
  Coins,
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
  "bg-gradient-to-br from-[#40196d] to-purple-600",
  "bg-gradient-to-br from-purple-500 to-[#40196d]", 
  "bg-gradient-to-br from-[#40196d]/80 to-purple-700",
  "bg-gradient-to-br from-purple-600 to-[#40196d]/90",
  "bg-gradient-to-br from-[#40196d]/70 to-purple-800",
  "bg-gradient-to-br from-purple-700 to-[#40196d]",
  "bg-gradient-to-br from-[#40196d]/60 to-purple-500",
  "bg-gradient-to-br from-purple-400 to-[#40196d]/80"
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
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
  const [activeIndex, setActiveIndex] = useState(0);
  const isDarkMode = theme === 'dark';

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
      
      // Set a simple notification count for demo purposes
      // In a real app, this would come from actual notification data
      setUnreadNotifications(3);
      
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
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const totalScrollWidth = container.scrollWidth;
    
    // Calculate current page based on scroll position
    const totalPages = Math.ceil(totalScrollWidth / containerWidth);
    const currentPage = Math.round(scrollLeft / containerWidth);
    setActiveIndex(Math.min(currentPage, totalPages - 1));
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

  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);
  const mainWallet = wallets.find(w => w.isMain);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-slate-50 via-purple-50 to-[#40196d]/10'
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
        : 'bg-gradient-to-br from-slate-50 via-purple-50 to-[#40196d]/10'
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
          <div className={`fixed inset-y-0 right-0 max-w-sm w-full backdrop-blur-md shadow-2xl border-l ${
            theme === 'dark'
              ? 'bg-slate-800/95 border-slate-700/50'
              : 'bg-white/95 border-white/20'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-slate-700' : 'border-gray-100'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-[#40196d] to-purple-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-4 w-4 text-white" />
                </div>
                <h2 className={`text-lg font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>Menu</h2>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className={`h-5 w-5 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                }`} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <button 
                onClick={() => {
                  navigate('/notifications');
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all group ${
                  theme === 'dark'
                    ? 'hover:bg-[#40196d]/20 hover:text-purple-300 text-slate-300'
                    : 'hover:bg-[#40196d]/10 hover:text-purple-700 text-slate-700'
                }`}
              >
                <div className={`relative p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-[#40196d]/20 group-hover:bg-[#40196d]/30'
                    : 'bg-[#40196d]/10 group-hover:bg-[#40196d]/20'
                }`}>
                  <Bell className={`h-4 w-4 ${
                    theme === 'dark' ? 'text-purple-400' : 'text-[#40196d]'
                  }`} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </div>
                <div className="text-left">
                  <span className={`font-medium ${
                    theme === 'dark' 
                      ? 'text-slate-200 group-hover:text-purple-300' 
                      : 'text-slate-900 group-hover:text-[#40196d]'
                  }`}>Notifications</span>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {unreadNotifications > 0 ? `${unreadNotifications} new updates` : 'No new notifications'}
                  </p>
                </div>
              </button>
              <button 
                onClick={handleLogout}
                className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all group ${
                  theme === 'dark'
                    ? 'hover:bg-red-900/30 hover:text-red-400 text-slate-300'
                    : 'hover:bg-red-50 hover:text-red-700 text-slate-700'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-red-900/30 group-hover:bg-red-800/40'
                    : 'bg-red-100 group-hover:bg-red-200'
                }`}>
                  <LogOut className="h-4 w-4 text-red-600" />
                </div>
                <div className="text-left">
                  <span className={`font-medium ${
                    theme === 'dark'
                      ? 'text-slate-200 group-hover:text-red-400'
                      : 'text-slate-900 group-hover:text-red-700'
                  }`}>Sign Out</span>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>End your session</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className={`relative z-10 backdrop-blur-xl border-b sticky top-0 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-slate-800/40 border-slate-700/50'
          : 'bg-white/70 border-white/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Welcome Message */}
            <div className="flex items-center">
              <div>
                <p className={`text-lg font-medium ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Welcome back, <span className={`font-semibold ${
                    theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                  }`}>{user?.name || 'User'}</span>
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
                      ? 'text-slate-300 hover:text-indigo-400 hover:bg-slate-700/50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
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

                <button 
                  onClick={() => navigate('/notifications')}
                  className={`relative p-3 rounded-xl transition-all duration-300 group ${
                    theme === 'dark'
                      ? 'text-slate-300 hover:text-indigo-400 hover:bg-slate-700/50'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs py-1 px-2 rounded-lg whitespace-nowrap ${
                    theme === 'dark' 
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-900 text-white'
                  }`}>
                    {unreadNotifications > 0 ? `${unreadNotifications} new notifications` : 'Notifications'}
                  </div>
                </button>
                
                <div className={`h-6 w-px ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-slate-300'
                }`}></div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#40196d] to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300 group ${
                      theme === 'dark'
                        ? 'text-slate-300 hover:text-red-400 hover:bg-red-900/30'
                        : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
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
                  ? 'text-slate-300 hover:text-indigo-400 hover:bg-slate-700/50'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50'
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Total Balance Card */}
          <div className={`group relative backdrop-blur-lg rounded-3xl p-8 border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
            theme === 'dark'
              ? 'bg-slate-800/40 border-slate-700/50'
              : 'bg-white/70 border-white/30'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wide ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Total Balance</p>
                  <p className={`text-3xl font-bold mt-2 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {formatCurrency(totalBalance)}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Banknote className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-[#40196d]/10 dark:bg-[#40196d]/20 px-2 py-1 rounded-full">
                  <TrendingUp className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-indigo-700 dark:text-indigo-300 font-bold text-xs">+2.5%</span>
                </div>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                }`}>vs last month</span>
              </div>
            </div>
          </div>

          {/* Active Wallets Card */}
          <div className={`group relative backdrop-blur-lg rounded-3xl p-8 border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
            theme === 'dark'
              ? 'bg-slate-800/40 border-slate-700/50'
              : 'bg-white/70 border-white/30'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>Active Wallets</p>
                  <p className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{wallets.length}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-[#40196d] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Wallet className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-4">
                <span className="font-medium">
                  {wallets.length > 0 ? `${5 - wallets.length} slots remaining` : 'Create your first wallet'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className={`group relative backdrop-blur-lg rounded-3xl p-8 border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
            theme === 'dark'
              ? 'bg-slate-800/40 border-slate-700/50'
              : 'bg-white/70 border-white/30'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className={`text-sm font-semibold uppercase tracking-wide mb-3 ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>This Week</p>
                  <p className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{transactions.length}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-500/25">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className={`text-sm mt-4 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <span className="font-medium">Total transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateWallet(true)}
            className="group relative flex items-center space-x-4 bg-gradient-to-r from-[#40196d] to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-[#40196d]/90 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={wallets.length >= 5}
          >
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <Plus className="h-3 w-3" />
            </div>
            <span className="ml-2">Create Wallet</span>
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button
            onClick={() => setShowDepositModal(true)}
            className="group relative flex items-center space-x-4 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/30 transform hover:-translate-y-0.5"
          >
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <Coins className="h-3 w-3 text-green-600" />
            </div>
            <span className="ml-2">Deposit Funds</span>
          </button>

          <button
            onClick={() => setShowSplitModal(true)}
            className="group relative flex items-center space-x-4 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-white/90 transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/30 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!mainWallet || parseFloat(mainWallet.balance) <= 0}
          >
            <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center">
              <ArrowUpDown className="h-3 w-3 text-purple-600" />
            </div>
            <span className="ml-2">Split Funds</span>
          </button>
        </div>

        {/* Wallets Section */}
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Wallets</h2>
              <p className="text-gray-600">Manage and monitor your wallet portfolio</p>
            </div>
            <button 
              onClick={() => navigate('/wallet')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg transform hover:-translate-y-0.5 ${
              theme === 'dark'
                ? "bg-[#40196d]/80 text-white shadow-lg hover:bg-[#40196d]/90"
                : "bg-[#40196d]/10 text-[#40196d] shadow-sm hover:bg-[#40196d]/20"
            }`}>
              View All
            </button>
          </div>

          {wallets.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#40196d]/10 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-10 w-10 text-[#40196d]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No wallets yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Get started by creating your first wallet. You can create up to 5 wallets to organize your funds.
              </p>
              <button
                onClick={() => setShowCreateWallet(true)}
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#40196d] to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-[#40196d]/90 hover:to-purple-700 transition-all duration-300 shadow-xl"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Wallet</span>
              </button>
            </div>
          ) : (
            <div
              onScroll={handleScroll}
              className="wallet-scroll-container flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 pb-6"
            >
              {wallets.map((wallet, index) => (
                <div
                  key={wallet.id}
                  className={`${walletColors[index % walletColors.length]} snap-center flex-shrink-0 w-80 sm:w-96 h-52 lg:h-56 rounded-3xl p-8 flex flex-col justify-between ${
                    isDarkMode 
                      ? 'border border-white/20 backdrop-blur-lg' 
                      : 'border border-white/30 backdrop-blur-md shadow-xl'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-base mb-3 font-medium ${
                        isDarkMode ? 'text-white/80' : 'text-white/90'
                      }`}>{wallet.name}</p>
                      {wallet.isMain && (
                        <span className={`px-3 py-2 rounded-xl text-sm font-medium ${
                          isDarkMode 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/30 text-white'
                        }`}>
                          Primary
                        </span>
                      )}
                    </div>
                    <Wallet className={`w-7 h-7 ${
                      isDarkMode ? 'text-white/60' : 'text-white/70'
                    }`} />
                  </div>
                  <div>
                    <p className="text-4xl lg:text-5xl font-bold text-white mb-3">
                      {formatCurrency(wallet.balance)}
                    </p>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-white/60' : 'text-white/70'
                    }`}>Available Balance</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Dots */}
          {wallets.length > 2 && (() => {
            // Show dots only if there are more cards than can fit on screen
            // Estimate 2-3 cards visible per page depending on screen size
            const cardsPerPage = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
            const totalPages = Math.ceil(wallets.length / cardsPerPage);
            
            const scrollToPage = (pageIndex: number) => {
              const container = document.querySelector('.wallet-scroll-container') as HTMLElement;
              if (container) {
                const containerWidth = container.clientWidth;
                const scrollPosition = pageIndex * containerWidth;
                container.scrollTo({
                  left: scrollPosition,
                  behavior: 'smooth'
                });
              }
            };
            
            return totalPages > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToPage(i)}
                    className={`h-3 w-3 rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-[#40196d] focus:ring-offset-2 ${
                      i === activeIndex 
                        ? "bg-[#40196d] dark:bg-purple-500 shadow-lg" 
                        : isDarkMode 
                          ? "bg-slate-600 hover:bg-slate-500" 
                          : "bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            );
          })()}
        </div>

        {/* Transactions Section */}
        <div className={`rounded-3xl p-10 border shadow-xl ${
          isDarkMode 
            ? 'bg-slate-800/40 border-white/20 backdrop-blur-lg' 
            : 'bg-white/70 border-white/30 backdrop-blur-md'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>Transactions</h2>
              <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Track your financial activity</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/transactions')}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-lg transform hover:-translate-y-0.5 ${
                  isDarkMode
                    ? "bg-[#40196d]/80 text-white shadow-lg hover:bg-[#40196d]/90"
                    : "bg-[#40196d]/10 text-[#40196d] shadow-sm hover:bg-[#40196d]/20"
                }`}
              >
                View All
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {transactions.length > 0 ? transactions.slice(0, 4).map((transaction) => (
              <div key={transaction.id} className={`flex items-center justify-between p-4 rounded-2xl transition-colors ${
                isDarkMode 
                  ? 'bg-slate-700/40 hover:bg-slate-700/60' 
                  : 'bg-slate-50/70 hover:bg-slate-100/70'
              }`}>
                <div className="flex items-center space-x-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    parseFloat(transaction.amount) > 0 
                      ? isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'
                      : isDarkMode ? 'bg-red-900/40' : 'bg-red-100'
                  }`}>
                    {parseFloat(transaction.amount) > 0 ? (
                      <TrendingUp className={`h-5 w-5 ${
                        parseFloat(transaction.amount) > 0 
                          ? isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                          : isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                    ) : (
                      <ArrowUpDown className={`h-5 w-5 ${
                        isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`} />
                    )}
                  </div>
                  <div className="ml-2">
                    <p className={`font-semibold text-base ${
                      isDarkMode ? 'text-slate-200' : 'text-slate-900'
                    }`}>{formatTransactionType(transaction.type)}</p>
                    <p className={`text-sm mt-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {new Date(transaction.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <span className={`text-lg font-bold ${
                  parseFloat(transaction.amount) > 0 
                    ? isDarkMode ? "text-emerald-400" : "text-emerald-600"
                    : isDarkMode ? "text-red-400" : "text-red-600"
                }`}>
                  {parseFloat(transaction.amount) > 0 ? "+" : ""}
                  {formatCurrency(transaction.amount)}
                </span>
              </div>
            )) : (
              <div className="text-center py-12">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'
                }`}>
                  <CreditCard className={`w-8 h-8 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-400'
                  }`} />
                </div>
                <h3 className={`text-lg font-medium mb-2 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-900'
                }`}>No transactions yet</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>Start by making a deposit to see your transaction history</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {/* Create Wallet Modal */}
      {showCreateWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl w-full max-w-md border shadow-2xl ${
            isDarkMode 
              ? 'bg-slate-800/95 border-slate-700/50 backdrop-blur-lg' 
              : 'bg-white border-white/30 backdrop-blur-md'
          }`}>
            <div className="p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Plus className="h-10 w-10 text-white" />
                </div>
                <h3 className={`text-3xl font-bold mb-3 ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>Create New Wallet</h3>
                <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Organize your finances with a custom wallet</p>
              </div>
              <form onSubmit={handleCreateWallet}>
                <div className="space-y-8">
                  <div>
                    <label className={`text-sm font-semibold mb-4 block ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Wallet Name
                    </label>
                    <input
                      type="text"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      placeholder="e.g., Savings, Emergency, Business"
                      className={`w-full p-5 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
                      }`}
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                    >
                      Create Wallet
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateWallet(false)}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                        isDarkMode 
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl w-full max-w-lg border shadow-2xl ${
            isDarkMode 
              ? 'bg-slate-800/95 border-slate-700/50 backdrop-blur-lg' 
              : 'bg-white border-white/30 backdrop-blur-md'
          }`}>
            <div className="p-10">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Banknote className="h-10 w-10 text-white" />
                </div>
                <h3 className={`text-3xl font-bold mb-3 ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>Deposit Funds</h3>
                <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Add money to your main wallet</p>
              </div>
              <form onSubmit={handleDeposit}>
                <div className="space-y-8">
                  <div>
                    <label className={`text-sm font-semibold mb-4 block ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Amount (₦)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="10000"
                      className={`w-full p-4 border rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' 
                          : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
                      }`}
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg"
                    >
                      Deposit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDepositModal(false)}
                      className={`flex-1 py-4 rounded-xl font-semibold transition-all ${
                        isDarkMode 
                          ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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

      {/* Split Modal */}
      {showSplitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-3xl w-full max-w-md border shadow-2xl ${
            isDarkMode 
              ? 'bg-slate-800/95 border-slate-700/50 backdrop-blur-lg' 
              : 'bg-white border-white/30 backdrop-blur-md'
          }`}>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ArrowUpDown className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  Split Funds
                </h3>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
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
