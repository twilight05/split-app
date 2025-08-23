import { Request, Response } from "express";
import {
  signupService,
  loginService,
  getProfileService,
} from "../services/auth.service";
import { AuthRequest } from "../middleware/auth";

export const signup = async (req: Request, res: Response) => {
  const { name, password, email, phoneNumber } = req.body;

  try {
    const user = await signupService(name, password, email, phoneNumber);
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body; 

  try {
    const { token, user } = await loginService(identifier, password);
    res.json({
       message: "Login successful", 
       token,
       user: {
         id: user.id,
         name: user.name,
         email: user.email,
         phoneNumber: user.phoneNumber,
       }
    });
  } catch (err: any) {
    res.status(401).json({ message: err.message || "Login failed" });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;

  try {
    const userProfile = await getProfileService(userId);
 

    const totalBalance = userProfile.wallets.reduce((sum, wallet) => {
      return sum + Number(wallet.balance);
    }, 0);

    res.json({
      user: {
        ...userProfile,
        totalBalance,
        walletCount: userProfile.wallets.length,
      }
    });
  } catch (err: any) {
    res.status(404).json({ message: err.message || "Could not fetch profile" });
  }
};