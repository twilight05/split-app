import {  Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import WalletService from "../services/wallet.service";

export const createWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, isMain, percentage } = req.body;
    const userId = req.userId!;

  if (!name) {
      return next(res.status(400).json({ message: "Wallet name is required" }));
    }

    if (isMain && (percentage !== null && percentage !== undefined && percentage < 0)) {
      return next(res.status(400).json({ message: "Invalid percentage" }));
    }
    
    const wallet = await WalletService.createWallet(name, isMain, percentage, userId);
    res.status(201).json({ wallet });

  } catch (error: any) {
    return next(res.status(500).json({ message: error.message || "Could not create wallet" }));
  }
}

export const getWallets = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    const wallets = await WalletService.getWallets(userId);

    res.status(200).json({ wallets });
  } catch (error: any) {
    return next(res.status(500).json({ message: error.message || "Could not retrieve wallets" }));
  }
}

export const getWalletById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const walletId = req.params.id;
    const userId = req.userId!;

    const wallet = await WalletService.getWalletById(walletId);
    if (!wallet) {
      return next(res.status(404).json({ message: "Wallet not found" }));
    }

    if (wallet.userId !== userId) {
      return next(res.status(403).json({ message: "Unauthorized" }));
    }

    res.status(200).json({ wallet });
  } catch (error: any) {
    return next(res.status(500).json({ message: error.message || "Could not retrieve wallet" }));
  }
}

export const updateWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const walletId = req.params.id;
    const userId = req.userId!;
    const { name, isMain, percentage } = req.body;
    const wallet = await WalletService.getWalletById(walletId);
    if (!wallet) {
      return next(res.status(404).json({ message: "Wallet not found" }));
    }
    if (wallet.userId !== userId) {
      return next(res.status(403).json({ message: "Unauthorized" }));
    }
    if (isMain && (percentage !== null && percentage !== undefined && percentage < 0)) {
      return next(res.status(400).json({ message: "Invalid percentage" }));
    }
    const updatedWallet = await WalletService.updateWallet(walletId, { name, isMain, percentage });
    res.status(200).json({ wallet: updatedWallet });
  }
  catch (error: any) {
    return next(res.status(500).json({ message: error.message || "Could not update wallet" }));
  }
}

export const deleteWallet = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const walletId = req.params.id;
    const userId = req.userId!;
    const wallet = await WalletService.getWalletById(walletId);

    if (!wallet) {
      return next(res.status(404).json({ message: "Wallet not found" }));
    } 

    if (wallet.userId !== userId) {
      return next(res.status(403).json({ message: "Unauthorized" }));
    }

    if (wallet.isMain) {
      return next(res.status(400).json({ message: "Cannot delete main wallet" }));
    }

    await WalletService.deleteWallet(walletId);
    res.status(200).json({ message: "Wallet deleted successfully" });

  } catch (error: any) {
    return next(res.status(500).json({ message: error.message || "Could not delete wallet" }));
  }
}

