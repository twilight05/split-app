import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../prisma/prisma";

export const signupService = async (
  name: string, 
  password: string, 
  email?: string, 
  phoneNumber?: string
) => {
  // Validation
  if (!name || !password) {
    throw new Error("Name and password are required");
  }

  if (!email && !phoneNumber) {
    throw new Error("Either email or phone number is required");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        email ? { email } : {},
        phoneNumber ? { phoneNumber } : {},
      ].filter(condition => Object.keys(condition).length > 0),
    },
  });

  if (existingUser) {
    throw new Error("User already exists with this email or phone number");
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: { 
      name, 
      password: hashed, 
      email: email || null,
      phoneNumber: phoneNumber || null
    },
  });

  // Create default main wallet
  await prisma.wallet.create({
    data: {
      userId: user.id,
      name: "Main Wallet",
      isMain: true,
      balance: 0.0,
    },
  });

  return user; // Added missing return statement
};

export const loginService = async (identifier: string, password: string) => {
  if (!identifier || !password) {
    throw new Error("Email or phone number and password are required");
  }

  // Find user by email or phone number
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phoneNumber: identifier },
      ],
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  // Return both token and user data
  return { 
    token, 
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber
    }
  };
};

export const getProfileService = async (userId: string) => {
  // Ensure user has a main wallet
  const mainWallet = await prisma.wallet.findFirst({
    where: { userId, isMain: true },
  });

  if (!mainWallet) {
    await prisma.wallet.create({
      data: {
        userId,
        name: "Main Wallet",
        isMain: true,
        balance: 0,
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      wallets: {
        select: {
          id: true,
          name: true,
          isMain: true,
          balance: true,
          percentage: true,
        },
        orderBy: [
          { isMain: 'desc' }, // Main wallet first
          { name: 'asc' }     // Then by name (until we add createdAt)
        ]
      }
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};