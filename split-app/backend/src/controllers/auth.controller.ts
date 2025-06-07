// controllers/auth.controller.ts
import { Request, Response } from "express";
import {
  signupService,
  loginService,
  getProfileService,
} from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await signupService(email, password);
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (err: any) {
    res.status(400).json({ message: err.message || "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const { token } = await loginService(email, password);
    res.json({ message: "Login successful", token });
  } catch (err: any) {
    res.status(401).json({ message: err.message || "Login failed" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const user = await getProfileService(userId);
    res.json({ user });
  } catch (err: any) {
    res.status(404).json({ message: err.message || "Could not fetch profile" });
  }
};
