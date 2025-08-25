import { prisma } from "../../prisma/prisma";


class WalletService {
  async createWallet(name: string, isMain: boolean, percentage: number | null, userId: string) {

    if (isMain) {
      const existingMain = await prisma.wallet.findFirst({
        where: { userId, isMain: true },
      });
      if (existingMain) {
        throw new Error("Main wallet already exists");
      }
    }

    // Check wallet count limit (1 main + 4 additional = 5 total)
    const walletCount = await prisma.wallet.count({
      where: { userId }
      
    });

    if (walletCount >= 5) {
      throw new Error("Maximum of 5 wallets allowed per user");
    }

    // Check if wallet name already exists for this user
    const existingWallet = await prisma.wallet.findFirst({
      where: {
        userId,
        name: name.trim()
      }
    });

    if (existingWallet) {
      throw new Error("Wallet with this name already exists");
    }

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name: name.trim(),
        isMain: isMain || false,
        percentage: percentage || null,
        balance: 0,
      },
    });

    return wallet;
};

    async getWallets(userId: string) {
    // Ensure user has a main wallet
    await this.ensureMainWallet(userId);
    
    const wallets = await prisma.wallet.findMany({
      where: { userId },
     orderBy: [
        { isMain: "desc" }, 
        { name: "asc" }
      ],
    });
    return wallets;
  }

  // Helper method to ensure user has a main wallet
  async ensureMainWallet(userId: string) {
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
  }

    async getWalletById(walletId: string, userId: string) {
    const wallet = await prisma.wallet.findFirst({
      where: { 
        id: walletId,
        userId 
      },
    });
     if (!wallet) {
      throw new Error("Wallet not found");
    }
    
    return wallet;
    }

    async updateWallet(walletId: string, userId: string, data: Partial<{ name: string; isMain: boolean; percentage: number | null }>) {
    const existingWallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId },
    });
    if (!existingWallet) {
      throw new Error("Wallet not found");
    }
      if (existingWallet.isMain && data.name) {
      throw new Error("Cannot rename main wallet");
    }
    // If updating name, check for duplicates
    if (data.name) {
      const duplicateWallet = await prisma.wallet.findFirst({
        where: {
          userId,
          name: data.name.trim(),
          NOT: { id: walletId }
        }
      });

      if (duplicateWallet) {
        throw new Error("Wallet with this name already exists");
      }
    }

    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data: {
        ...data,
        name: data.name ? data.name.trim() : undefined
      },
    });
    return wallet;
  }
    async deleteWallet(walletId: string, userId: string) {
    const wallet = await prisma.wallet.findFirst({
      where: { id: walletId, userId }
    });

    if (!wallet) {
      throw new Error("Wallet not found");
    }
    if (wallet.isMain) {
      throw new Error("Cannot delete main wallet");
    }

    if (Number(wallet.balance) > 0) {
      throw new Error("Cannot delete wallet with remaining balance");
    }
     await prisma.wallet.delete({
      where: { id: walletId },
    });

    return { message: "Wallet deleted successfully" };
  }

    async depositToMainWallet(userId: string, amount: number) {
    // Ensure user has a main wallet
    await this.ensureMainWallet(userId);
    
    const mainWallet = await prisma.wallet.findFirst({
      where: {
        userId,
        isMain: true
      }
    });

    if (!mainWallet) {
      throw new Error("Main wallet not found");
    }

    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }
      const updatedWallet = await prisma.wallet.update({
      where: { id: mainWallet.id },
      data: {
        balance: {
          increment: amount
        }
      }
    });
    await prisma.transaction.create({
      data: {
        walletId: mainWallet.id,
        userId,
        amount,
        type: 'DEPOSIT'
      }
    });

    return updatedWallet;
  }

  // Split funds from main wallet to other wallets
  async splitFunds(
    userId: string, 
    splits: { walletId: string; amount?: number; percentage?: number }[]
  ) {
    // Ensure user has a main wallet
    await this.ensureMainWallet(userId);
    
    const mainWallet = await prisma.wallet.findFirst({
      where: {
        userId,
        isMain: true
      }
    });

    if (!mainWallet) {
      throw new Error("Main wallet not found");
    }

    const mainBalance = Number(mainWallet.balance);
    let totalAmount = 0;

    // Validate splits and calculate total amount
    for (const split of splits) {
      // Ensure the target wallet exists and belongs to user
      const targetWallet = await prisma.wallet.findFirst({
        where: {
          id: split.walletId,
          userId
        }
      });

      if (!targetWallet) {
        throw new Error(`Target wallet not found: ${split.walletId}`);
      }

      if (targetWallet.isMain) {
        throw new Error("Cannot split funds to main wallet");
      }

      if (split.amount) {
        if (split.amount <= 0) {
          throw new Error("Split amount must be positive");
        }
        totalAmount += split.amount;
      } else if (split.percentage) {
        if (split.percentage <= 0 || split.percentage > 100) {
          throw new Error("Split percentage must be between 1-100");
        }
        totalAmount += (mainBalance * split.percentage) / 100;
      } else {
        throw new Error("Each split must have either amount or percentage");
      }
    }

    if (totalAmount > mainBalance) {
      throw new Error("Insufficient funds in main wallet");
    }

    // Perform the splits in a database transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from main wallet
      await tx.wallet.update({
        where: { id: mainWallet.id },
        data: {
          balance: {
            decrement: totalAmount
          }
        }
      });

      // Record withdrawal from main wallet
      await tx.transaction.create({
        data: {
          walletId: mainWallet.id,
          userId,
          amount: -totalAmount,
          type: 'SPLIT'
        }
      });

      // Add to target wallets
      for (const split of splits) {
        let amountToAdd = 0;
        
        if (split.amount) {
          amountToAdd = split.amount;
        } else if (split.percentage) {
          amountToAdd = (mainBalance * split.percentage) / 100;
        }

        // Update target wallet
        await tx.wallet.update({
          where: { id: split.walletId },
          data: {
            balance: {
              increment: amountToAdd
            }
          }
        });

        // Record transfer to target wallet
        await tx.transaction.create({
          data: {
            walletId: split.walletId,
            userId,
            amount: amountToAdd,
            type: 'TRANSFER'
          }
        });
      }

      return { message: "Funds split successfully", totalAmount };
    });

    return result;
  }

  // NEW: Get wallet transactions
  async getWalletTransactions(walletId: string, userId: string) {
    // Ensure user owns this wallet
    const wallet = await this.getWalletById(walletId, userId);
    
    const transactions = await prisma.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 transactions
    });

    return transactions;
  }

}

export default new WalletService();