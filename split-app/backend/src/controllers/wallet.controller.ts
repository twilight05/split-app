import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import WalletService from "../services/wallet.service";

export const createWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    const userId = req.userId!;

    console.log('Creating wallet:', { name, userId }); // Debug log

    if (!name?.trim()) {
      res.status(400).json({ message: "Wallet name is required" });
      return;
    }

    const wallet = await WalletService.createWallet(name, false, null, userId);
    res.status(201).json({ message: "Wallet created successfully", wallet });
  } catch (error: any) {
    console.error('Wallet creation error:', error); // Debug log
    res.status(400).json({ message: error.message });
  }
};

export const getUserWallets = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const wallets = await WalletService.getWallets(userId);
    res.json({ wallets });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Export alias for routes compatibility
export const getWallets = getUserWallets;

export const getWalletById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;
    const userId = req.userId!;
    
    const wallet = await WalletService.getWalletById(walletId, userId);
    res.json({ wallet });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;
    const { name } = req.body;
    const userId = req.userId!;

    if (!name?.trim()) {
      res.status(400).json({ message: "Wallet name is required" });
      return;
    }

    const wallet = await WalletService.updateWallet(walletId, userId, { name });
    res.json({ message: "Wallet updated successfully", wallet });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;
    const userId = req.userId!;

    const result = await WalletService.deleteWallet(walletId, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const depositToMainWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    const userId = req.userId!;

    console.log('Deposit attempt:', { amount, userId }); // Debug log

    if (!amount || amount <= 0) {
      res.status(400).json({ message: "Valid amount is required" });
      return;
    }

    const wallet = await WalletService.depositToMainWallet(userId, Number(amount));
    res.json({ message: "Deposit successful", wallet });
  } catch (error: any) {
    console.error('Deposit error:', error); // Debug log
    res.status(400).json({ message: error.message });
  }
};

export const splitFunds = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { splits } = req.body;
    const userId = req.userId!;

    if (!splits || !Array.isArray(splits) || splits.length === 0) {
      res.status(400).json({ message: "Valid splits array is required" });
      return;
    }

    // Validate splits
    for (const split of splits) {
      if (!split.walletId) {
        res.status(400).json({ message: "Each split must have a walletId" });
        return;
      }
      if (!split.amount && !split.percentage) {
        res.status(400).json({ message: "Each split must have either amount or percentage" });
        return;
      }
      if (split.amount && split.amount <= 0) {
        res.status(400).json({ message: "Split amount must be positive" });
        return;
      }
      if (split.percentage && (split.percentage <= 0 || split.percentage > 100)) {
        res.status(400).json({ message: "Split percentage must be between 1-100" });
        return;
      }
    }

    const result = await WalletService.splitFunds(userId, splits);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getWalletTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { walletId } = req.params;
    const userId = req.userId!;

    const transactions = await WalletService.getWalletTransactions(walletId, userId);
    res.json({ transactions });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};