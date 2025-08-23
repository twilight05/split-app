import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import {
  createWallet,
  getUserWallets,
  getWalletById,
  updateWallet,
  deleteWallet,
  depositToMainWallet,
  splitFunds,
  getWalletTransactions
} from "../controllers/wallet.controller";

const router = Router();

// All wallet routes require authentication
router.use(authenticateToken);

// Get all user wallets
router.get("/", getUserWallets);

// Create new wallet
router.post("/", createWallet);

// Deposit to main wallet
router.post("/deposit", depositToMainWallet);

// Split funds from main wallet
router.post("/split", splitFunds);

// Get specific wallet
router.get("/:walletId", getWalletById);

// Update wallet
router.put("/:walletId", updateWallet);

// Delete wallet
router.delete("/:walletId", deleteWallet);

// Get wallet transactions
router.get("/:walletId/transactions", getWalletTransactions);

export default router;