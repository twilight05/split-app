import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Wallet as WalletIcon,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { walletAPI } from "../components/services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface WalletType {
  id: string;
  name: string;
  balance: string;
  isMain: boolean;
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

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalances, setShowBalances] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [editWalletName, setEditWalletName] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const fetchWallets = async () => {
      try {
        setLoading(true);
        const response = await walletAPI.getWallets();
        setWallets(response.wallets || []);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch wallets");
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₦${num.toLocaleString()}`;
  };

  const totalBalance = wallets.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0);

  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) {
      toast.error("Please enter a wallet name");
      return;
    }

    try {
      await walletAPI.createWallet(newWalletName.trim());
      toast.success("Wallet created successfully!");
      setNewWalletName("");
      setShowCreateModal(false);
      
      // Refresh wallets
      const response = await walletAPI.getWallets();
      setWallets(response.wallets || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to create wallet");
    }
  };

  const handleEditWallet = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setEditWalletName(wallet.name);
    setShowEditModal(true);
  };

  const handleUpdateWallet = async () => {
    if (!selectedWallet || !editWalletName.trim()) {
      toast.error("Please enter a wallet name");
      return;
    }

    try {
      await walletAPI.updateWallet(selectedWallet.id, editWalletName.trim());
      toast.success("Wallet updated successfully!");
      setEditWalletName("");
      setSelectedWallet(null);
      setShowEditModal(false);
      
      // Refresh wallets
      const response = await walletAPI.getWallets();
      setWallets(response.wallets || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to update wallet");
    }
  };

  const handleDeleteWallet = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setShowDeleteModal(true);
  };

  const confirmDeleteWallet = async () => {
    if (!selectedWallet) return;

    try {
      await walletAPI.deleteWallet(selectedWallet.id);
      toast.success("Wallet deleted successfully!");
      setSelectedWallet(null);
      setShowDeleteModal(false);
      
      // Refresh wallets
      const response = await walletAPI.getWallets();
      setWallets(response.wallets || []);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete wallet");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
          : 'bg-gradient-to-br from-slate-50 via-purple-50 to-[#40196d]/10'
      }`}>
        <div className={`backdrop-blur-sm rounded-2xl p-8 shadow-2xl border ${
          isDarkMode
            ? 'bg-gray-800/80 border-gray-700/20'
            : 'bg-white/80 border-white/20'
        }`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#40196d] mx-auto"></div>
          <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading wallets...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-purple-50 to-[#40196d]/10'
    }`}>
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`p-3 rounded-xl transition-all hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-slate-700/50 hover:bg-slate-700/70 text-slate-300' 
                  : 'bg-white/80 hover:bg-white text-slate-700'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>Your Wallets</h1>
              <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Manage your wallet portfolio
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className={`p-3 rounded-xl transition-all hover:shadow-lg ${
                isDarkMode 
                  ? 'bg-slate-700/50 hover:bg-slate-700/70 text-slate-300' 
                  : 'bg-white/80 hover:bg-white text-slate-700'
              }`}
            >
              {showBalances ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              disabled={wallets.length >= 5}
              className="flex items-center space-x-3 bg-gradient-to-r from-[#40196d] to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-[#40196d]/90 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
              <span>Create Wallet</span>
            </button>
          </div>
        </div>

        {/* Total Balance Card */}
        <div className={`rounded-3xl p-8 mb-8 ${
          isDarkMode 
            ? 'bg-slate-800/60 backdrop-blur-sm border border-slate-700/30' 
            : 'bg-white/80 backdrop-blur-sm border border-white/30'
        } shadow-2xl`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>Total Balance</p>
              <p className={`text-4xl font-bold mt-2 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}>
                {showBalances ? formatCurrency(totalBalance) : '₦••••••'}
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#40196d] to-purple-600 rounded-2xl flex items-center justify-center">
              <WalletIcon className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        {/* Wallets Grid */}
        {wallets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-[#40196d]/10 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <WalletIcon className="h-10 w-10 text-[#40196d]" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-900'
            }`}>No wallets yet</h3>
            <p className={`mb-8 max-w-md mx-auto ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Get started by creating your first wallet. You can create up to 5 wallets to organize your funds.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-[#40196d] to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-[#40196d]/90 hover:to-purple-700 transition-all duration-300 shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Create Your First Wallet</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet, index) => (
              <div
                key={wallet.id}
                className={`${walletColors[index % walletColors.length]} relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 group`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-bold">{wallet.name}</h3>
                        {wallet.isMain && (
                          <span className="bg-white/20 text-xs px-2 py-1 rounded-full font-medium">
                            Main
                          </span>
                        )}
                      </div>
                      <p className="text-white/70 text-sm">
                        Created {new Date(wallet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="relative dropdown-container">
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === wallet.id ? null : wallet.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === wallet.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/20 z-10 overflow-hidden">
                          <button
                            onClick={() => {
                              handleEditWallet(wallet);
                              setOpenDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-slate-700 hover:bg-[#40196d]/10 transition-colors flex items-center space-x-3"
                          >
                            <Edit3 className="h-4 w-4" />
                            <span>Edit Wallet</span>
                          </button>
                          {!wallet.isMain && (
                            <button
                              onClick={() => {
                                handleDeleteWallet(wallet);
                                setOpenDropdown(null);
                              }}
                              className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Delete Wallet</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/70 text-sm">Balance</p>
                      <p className="text-3xl font-bold">
                        {showBalances ? formatCurrency(wallet.balance) : '₦••••••'}
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-white/50 text-xs">
                        Click the menu icon for options
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Wallet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${
            isDarkMode 
              ? 'bg-slate-800/90 border border-slate-700/30' 
              : 'bg-white/90 border border-white/30'
          } backdrop-blur-xl`}>
            <h3 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-900'
            }`}>Create New Wallet</h3>
            
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Enter wallet name"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#40196d] focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateWallet()}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                    isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWallet}
                  className="flex-1 bg-gradient-to-r from-[#40196d] to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-[#40196d]/90 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Wallet Modal */}
      {showEditModal && selectedWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${
            isDarkMode 
              ? 'bg-slate-800/90 border border-slate-700/30' 
              : 'bg-white/90 border border-white/30'
          } backdrop-blur-xl`}>
            <h3 className={`text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-slate-100' : 'text-slate-900'
            }`}>Edit Wallet</h3>
            
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Wallet Name
                </label>
                <input
                  type="text"
                  value={editWalletName}
                  onChange={(e) => setEditWalletName(e.target.value)}
                  placeholder="Enter wallet name"
                  className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#40196d] focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-400' 
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500'
                  }`}
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateWallet()}
                />
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedWallet(null);
                    setEditWalletName("");
                  }}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                    isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateWallet}
                  className="flex-1 bg-gradient-to-r from-[#40196d] to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:from-[#40196d]/90 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Wallet Modal */}
      {showDeleteModal && selectedWallet && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl ${
            isDarkMode 
              ? 'bg-slate-800/90 border border-slate-700/30' 
              : 'bg-white/90 border border-white/30'
          } backdrop-blur-xl`}>
            <h3 className={`text-2xl font-bold mb-6 text-red-500`}>Delete Wallet</h3>
            
            <div className="space-y-6">
              <div>
                <p className={`text-base ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Are you sure you want to delete the wallet <strong>"{selectedWallet.name}"</strong>?
                </p>
                <p className={`text-sm mt-2 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  This action cannot be undone. All data associated with this wallet will be permanently deleted.
                </p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedWallet(null);
                  }}
                  className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${
                    isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-slate-300' 
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteWallet}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
