import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  TrendingUp, 
  ArrowUpDown, 
  Search,
  Download
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { walletAPI } from "../components/services/api";
import { toast } from "react-hot-toast";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  createdAt: string;
  walletId: string;
}

const Transactions: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        // First fetch wallets to get the main wallet ID
        const walletsResponse = await walletAPI.getWallets();
        const wallets = walletsResponse.wallets || [];
        const mainWallet = wallets.find((w: any) => w.isMain);
        
        if (mainWallet) {
          // Then fetch transactions using the main wallet ID
          const response = await walletAPI.getTransactions(mainWallet.id);
          setTransactions(response.transactions || []);
        } else {
          toast.error("No main wallet found");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

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

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped = transactions.reduce((groups: { [key: string]: Transaction[] }, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});

    return Object.entries(grouped).sort(([dateA], [dateB]) => {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === "All" || 
      (filter === "Credit" && parseFloat(transaction.amount) > 0) ||
      (filter === "Debit" && parseFloat(transaction.amount) < 0);
    
    const matchesSearch = searchTerm === "" || 
      formatTransactionType(transaction.type).toLowerCase().includes(searchTerm.toLowerCase()) ||
      formatCurrency(transaction.amount).toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(transaction.createdAt).toLocaleDateString().includes(searchTerm) ||
      new Date(transaction.createdAt).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }).toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const groupedTransactions = groupTransactionsByDate(filteredTransactions);

  const totalCredit = transactions
    .filter(t => parseFloat(t.amount) > 0)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalDebit = transactions
    .filter(t => parseFloat(t.amount) < 0)
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-slate-50 via-purple-50 to-[#40196d]/10'
      }`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-[#40196d] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-purple-50 to-[#40196d]/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className={`flex items-center space-x-3 mb-6 px-4 py-2 rounded-xl transition-all duration-300 ${
              isDarkMode
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Transaction History</h1>
              <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Track all your financial activities
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                isDarkMode
                  ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  : 'bg-white/50 text-slate-600 hover:bg-white/80'
              }`}>
                <Download className="h-4 w-4" />
                <span className="text-sm font-medium">Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-lg' 
              : 'bg-white/70 border-white/30 backdrop-blur-md'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Total Transactions</p>
                <p className={`text-2xl font-bold mt-1 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>{transactions.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-[#40196d] to-purple-600 rounded-xl flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-lg' 
              : 'bg-white/70 border-white/30 backdrop-blur-md'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Total Credits</p>
                <p className="text-2xl font-bold mt-1 text-emerald-500">
                  {formatCurrency(totalCredit)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${
            isDarkMode 
              ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-lg' 
              : 'bg-white/70 border-white/30 backdrop-blur-md'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>Total Debits</p>
                <p className="text-2xl font-bold mt-1 text-red-500">
                  {formatCurrency(totalDebit)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <ArrowUpDown className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className={`p-6 rounded-2xl border mb-8 ${
          isDarkMode 
            ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-lg' 
            : 'bg-white/70 border-white/30 backdrop-blur-md'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by type, amount, or date..."
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#40196d] focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {["All", "Credit", "Debit"].map((filterOption) => (
                <button
                  key={filterOption}
                  onClick={() => setFilter(filterOption)}
                  className={`px-6 py-3 rounded-xl text-sm font-medium transition-all ${
                    filter === filterOption
                      ? isDarkMode
                        ? "bg-[#40196d]/80 text-white shadow-lg"
                        : "bg-[#40196d]/10 text-[#40196d] shadow-sm"
                      : isDarkMode
                        ? "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className={`rounded-2xl border ${
          isDarkMode 
            ? 'bg-slate-800/40 border-slate-700/50 backdrop-blur-lg' 
            : 'bg-white/70 border-white/30 backdrop-blur-md'
        }`}>
          <div className="p-8">
            {groupedTransactions.length > 0 ? (
              <div className="space-y-8">
                {groupedTransactions.map(([date, dateTransactions]) => (
                  <div key={date} className="space-y-4">
                    {/* Date Header */}
                    <div className={`sticky top-0 py-3 px-6 mx-2 rounded-xl ${
                      isDarkMode 
                        ? 'bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-700/30' 
                        : 'bg-white/90 backdrop-blur-sm shadow-lg border border-slate-200/30'
                    }`}>
                      <h4 className={`text-sm font-semibold ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>{date}</h4>
                    </div>
                    
                    {/* Transactions for this date */}
                    <div className="space-y-4 px-2">
                      {dateTransactions.map((transaction) => (
                        <div key={transaction.id} className={`flex items-center justify-between p-6 rounded-2xl transition-colors border ${
                          isDarkMode 
                            ? 'bg-slate-700/40 hover:bg-slate-700/60 border-slate-600/30 hover:border-slate-500/50' 
                            : 'bg-slate-50/70 hover:bg-slate-100/70 border-slate-200/50 hover:border-slate-300/70'
                        }`}>
                          <div className="flex items-center space-x-5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              parseFloat(transaction.amount) > 0 
                                ? isDarkMode ? 'bg-emerald-900/40' : 'bg-emerald-100'
                                : isDarkMode ? 'bg-red-900/40' : 'bg-red-100'
                            }`}>
                              {parseFloat(transaction.amount) > 0 ? (
                                <TrendingUp className={`h-5 w-5 ${
                                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
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
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100'
                }`}>
                  <ArrowUpDown className={`h-8 w-8 ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>No transactions found</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  {searchTerm || filter !== "All" 
                    ? "Try adjusting your search or filter criteria"
                    : "Your transaction history will appear here"
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;