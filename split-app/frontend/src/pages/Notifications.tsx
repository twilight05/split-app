import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  ArrowLeft,
  Check,
  CheckCheck,
  Trash2,
  Search,
  MoreVertical,
  Sun,
  Moon
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useTheme } from "../contexts/ThemeContext";
import { walletAPI } from "../components/services/api";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "wallet" | "transaction" | "security" | "info" | "promotion" | "system";
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: {
    amount?: string;
    walletName?: string;
    transactionId?: string;
  };
}

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "unread" | "read" | string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showActions, setShowActions] = useState(false);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    filterNotifications();
  }, [notifications, selectedFilter, searchQuery]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Get actual wallet and transaction data to generate notifications
      const walletsData = await walletAPI.getWallets();
      const wallets = walletsData.wallets || [];
      
      const generatedNotifications: Notification[] = [];
      
      // Generate notifications from wallet data
      wallets.forEach((wallet: any) => {
        if (!wallet.isMain) {
          generatedNotifications.push({
            id: `wallet-${wallet.id}`,
            title: "Wallet Created",
            message: `You created '${wallet.name}' wallet`,
            type: "wallet",
            isRead: true,
            createdAt: wallet.createdAt,
            metadata: { walletName: wallet.name }
          });
        }
      });
      
      // Get transactions from main wallet
      const mainWallet = wallets.find((w: any) => w.isMain);
      if (mainWallet) {
        try {
          const transData = await walletAPI.getTransactions(mainWallet.id);
          const transactions = transData.transactions || [];
          
          // Generate notifications from recent transactions
          transactions.slice(0, 10).forEach((transaction: any) => {
            const notificationId = `transaction-${transaction.id}`;
            let title = "";
            let message = "";
            
            switch (transaction.type) {
              case "DEPOSIT":
                title = "Deposit Successful";
                message = `₦${transaction.amount} has been deposited to your Main Wallet`;
                break;
              case "SPLIT":
                title = "Split Completed";
                message = `₦${transaction.amount} split to wallet successfully`;
                break;
              case "TRANSFER":
                title = "Transfer Completed";
                message = `₦${transaction.amount} transferred successfully`;
                break;
              default:
                title = "Transaction Completed";
                message = `₦${transaction.amount} ${transaction.type.toLowerCase()} completed`;
            }
            
            generatedNotifications.push({
              id: notificationId,
              title,
              message,
              type: "transaction",
              isRead: Math.random() > 0.3, // Randomly mark some as unread for demo
              createdAt: transaction.createdAt,
              metadata: { 
                amount: `₦${transaction.amount}`,
                transactionId: transaction.id
              }
            });
          });
        } catch (transError) {
          console.log("No transactions found");
        }
      }
      
      // Add some system notifications
      generatedNotifications.push(
        {
          id: "welcome",
          title: "Welcome to Split!",
          message: "Get started by creating wallets and managing your finances",
          type: "info",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 1 week ago
        },
        {
          id: "security",
          title: "Account Security",
          message: "Your account is secure and all transactions are encrypted",
          type: "security",
          isRead: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        }
      );
      
      // Sort notifications by date (newest first)
      generatedNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setNotifications(generatedNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to load notifications");
      
      // Fallback to basic notifications if API fails
      const fallbackNotifications: Notification[] = [
        {
          id: "1",
          title: "Welcome to Split!",
          message: "Start by connecting to your wallet and making transactions",
          type: "info",
          isRead: false,
          createdAt: new Date().toISOString(),
        }
      ];
      setNotifications(fallbackNotifications);
    } finally {
      setLoading(false);
    }
  };

  const filterNotifications = () => {
    let filtered = notifications;

    // Apply read/unread filter
    if (selectedFilter === "unread") {
      filtered = filtered.filter(n => !n.isRead);
    } else if (selectedFilter === "read") {
      filtered = filtered.filter(n => n.isRead);
    } else if (selectedFilter !== "all") {
      // Filter by notification type
      filtered = filtered.filter(n => n.type === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(query) || 
        n.message.toLowerCase().includes(query)
      );
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Update local state since we don't have backend notifications yet
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      // Update local state since we don't have backend notifications yet
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: false } : n)
      );
      toast.success("Marked as unread");
    } catch (error) {
      toast.error("Failed to mark as unread");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Update local state since we don't have backend notifications yet
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success("Notification deleted");
    } catch (error) {
      toast.error("Failed to delete notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state since we don't have backend notifications yet
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all as read");
    }
  };

  const deleteSelected = async () => {
    try {
      // Update local state since we don't have backend notifications yet
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
      setSelectedNotifications([]);
      setShowActions(false);
      toast.success(`${selectedNotifications.length} notifications deleted`);
    } catch (error) {
      toast.error("Failed to delete notifications");
    }
  };

  const toggleNotificationSelection = (notificationId: string) => {
    setSelectedNotifications(prev => {
      if (prev.includes(notificationId)) {
        return prev.filter(id => id !== notificationId);
      } else {
        return [...prev, notificationId];
      }
    });
  };

  const selectAllVisible = () => {
    const visibleIds = filteredNotifications.map(n => n.id);
    setSelectedNotifications(visibleIds);
  };

  const clearSelection = () => {
    setSelectedNotifications([]);
    setShowActions(false);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${diffInDays}d ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filterOptions = [
    { value: "all", label: "All", count: notifications.length },
    { value: "unread", label: "Unread", count: unreadCount },
    { value: "read", label: "Read", count: notifications.length - unreadCount },
    { value: "wallet", label: "Wallet", count: notifications.filter(n => n.type === "wallet").length },
    { value: "transaction", label: "Transaction", count: notifications.filter(n => n.type === "transaction").length },
    { value: "security", label: "Security", count: notifications.filter(n => n.type === "security").length },
    { value: "promotion", label: "Promotion", count: notifications.filter(n => n.type === "promotion").length },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#40196d] border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen overflow-hidden no-scrollbar ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b sticky top-0 z-10`}>
        <div className="px-4 py-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {unreadCount} unread notifications
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              {selectedNotifications.length > 0 && (
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 rounded-xl bg-[#40196d] text-white hover:bg-[#40196d]/90 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Menu */}
          {showActions && selectedNotifications.length > 0 && (
            <div className={`mt-6 p-5 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} border ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedNotifications.length} selected
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={deleteSelected}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={clearSelection}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-slate-600 text-white hover:bg-slate-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="mt-6 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-[#40196d]' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#40196d]'
                } border focus:outline-none focus:ring-2 focus:ring-[#40196d]/20`}
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar pb-2">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedFilter === option.value
                        ? 'bg-[#40196d] text-white'
                        : isDarkMode
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {option.label} {option.count > 0 && `(${option.count})`}
                  </button>
                ))}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-5 py-2.5 rounded-xl bg-[#40196d] text-white text-sm font-medium hover:bg-[#40196d]/90 transition-colors whitespace-nowrap"
                >
                  Mark All Read
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-5xl mx-auto">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-20">
              <Bell className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {searchQuery || selectedFilter !== "all" ? "No matching notifications" : "No notifications yet"}
              </h3>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                {searchQuery || selectedFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "You'll see notifications about your wallet activity here"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedNotifications.length === 0 && filteredNotifications.length > 1 && (
                <div className="flex justify-end mb-2">
                  <button
                    onClick={selectAllVisible}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Select all visible
                  </button>
                </div>
              )}

              {filteredNotifications.map((notification) => {
                const isSelected = selectedNotifications.includes(notification.id);
                
                return (
                  <div
                    key={notification.id}
                    className={`group relative p-3 sm:p-4 mb-3 sm:mb-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#40196d] bg-[#40196d]/5'
                        : isDarkMode 
                        ? `bg-slate-800 border-slate-700 hover:border-slate-600 ${!notification.isRead ? 'border-[#40196d]/30' : ''}`
                        : `bg-white border-gray-200 hover:border-gray-300 hover:shadow-md ${!notification.isRead ? 'border-[#40196d]/30 shadow-sm' : ''}`
                    }`}
                  >
                    <div className="flex items-start space-x-4 sm:space-x-8">
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleNotificationSelection(notification.id)}
                        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#40196d] border-[#40196d]'
                            : isDarkMode
                            ? 'border-slate-500 hover:border-slate-400'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0 ml-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {notification.title}
                              </h3>
                              {!notification.isRead && (
                                <span className="w-2 h-2 bg-[#40196d] rounded-full"></span>
                              )}
                            </div>
                            <p className={`mt-1.5 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <p className={`mt-2 text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                              {getRelativeTime(notification.createdAt)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => notification.isRead ? markAsUnread(notification.id) : markAsRead(notification.id)}
                              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                              title={notification.isRead ? "Mark as unread" : "Mark as read"}
                            >
                              {notification.isRead ? (
                                <Bell className="w-4 h-4" />
                              ) : (
                                <CheckCheck className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'} text-red-500 hover:text-red-600`}
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;