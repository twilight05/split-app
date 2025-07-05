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

    const wallet = await prisma.wallet.create({
      data: {
        userId,
        name,
        isMain: isMain || false,
        percentage: percentage || null,
        balance: 0,
      },
    });

    return wallet;
};

    async getWallets(userId: string) {
    const wallets = await prisma.wallet.findMany({
      where: { userId },
      orderBy: { isMain: "desc",  },
    });
    return wallets;
  }

    async getWalletById(walletId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { id: walletId },
    });
    return wallet;
    }

    async updateWallet(walletId: string, data: Partial<{ name: string; isMain: boolean; percentage: number | null }>) {
    const wallet = await prisma.wallet.update({
      where: { id: walletId },
      data,
    });
    return wallet;
  }

    async deleteWallet(walletId: string) {
    const wallet = await prisma.wallet.delete({
      where: { id: walletId },
    });
    return wallet;
  }
}

export default new WalletService();