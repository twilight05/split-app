const API_BASE = "http://localhost:5000/api";

// Get auth token
const getAuthToken = () => localStorage.getItem("token");

// API headers with auth
const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getAuthToken()}`
});

// Auth API
export const authAPI = {
  login: async (identifier: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }
    
    return response.json();
  },

  signup: async (name: string, password: string, email?: string, phoneNumber?: string) => {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, email, phoneNumber }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }
    
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }
    
    return response.json();
  }
};

// Wallet API
export const walletAPI = {
  // Get all user wallets
  getWallets: async () => {
    const response = await fetch(`${API_BASE}/wallet`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch wallets");
    }
    
    return response.json();
  },

  // Create new wallet
  createWallet: async (name: string) => {
    const response = await fetch(`${API_BASE}/wallet`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create wallet");
    }
    
    return response.json();
  },

  // Get specific wallet
  getWallet: async (walletId: string) => {
    const response = await fetch(`${API_BASE}/wallet/${walletId}`, {

      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch wallet");
    }
    
    return response.json();
  },

  // Update wallet
  updateWallet: async (walletId: string, name: string) => {
    const response = await fetch(`${API_BASE}/wallet/${walletId}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update wallet");
    }
    
    return response.json();
  },

  // Delete wallet
  deleteWallet: async (walletId: string) => {
    const response = await fetch(`${API_BASE}/wallet/${walletId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete wallet");
    }
    
    return response.json();
  },

  // Deposit to main wallet
  deposit: async (amount: number) => {
    const response = await fetch(`${API_BASE}/wallet/deposit`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to deposit");
    }
    
    return response.json();
  },

  // Split funds
  splitFunds: async (splits: { walletId: string; amount?: number; percentage?: number }[]) => {
    const response = await fetch(`${API_BASE}/wallet/split`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ splits }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to split funds");
    }
    
    return response.json();
  },

  // Get wallet transactions
  getTransactions: async (walletId: string) => {
    const response = await fetch(`${API_BASE}/wallet/${walletId}/transactions`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch transactions");
    }
    
    return response.json();
  }
};