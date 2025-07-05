import express from "express";
import { createWallet, deleteWallet, getWalletById, getWallets, updateWallet } from "../controllers/wallet.controller";
import { authenticateToken } from "../middleware/auth";


const router = express.Router();

router.post("/create", authenticateToken, createWallet);
router.get("/", authenticateToken, getWallets);
router.get("/:id", authenticateToken, getWalletById);
router.put("/:id", authenticateToken, updateWallet);
router.delete("/:id", authenticateToken, deleteWallet);

export default router;
