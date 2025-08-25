-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Wallet" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add missing columns to Transaction table
ALTER TABLE "Transaction" ADD COLUMN "userId" TEXT;

-- Update existing transactions to link to users
UPDATE "Transaction" SET "userId" = (
  SELECT "userId" FROM "Wallet" WHERE "Wallet"."id" = "Transaction"."walletId"
);

-- Make userId column NOT NULL after populating it
ALTER TABLE "Transaction" ALTER COLUMN "userId" SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
