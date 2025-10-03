-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Wallet" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add missing columns to Transaction table (only if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Transaction' AND column_name='userId') THEN
        ALTER TABLE "Transaction" ADD COLUMN "userId" TEXT;
    END IF;
END $$;

-- Update existing transactions to link to users (only if userId is null)
UPDATE "Transaction" SET "userId" = (
  SELECT "userId" FROM "Wallet" WHERE "Wallet"."id" = "Transaction"."walletId"
) WHERE "userId" IS NULL;

-- Make userId column NOT NULL after populating it
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Transaction' AND column_name='userId' AND is_nullable='YES') THEN
        ALTER TABLE "Transaction" ALTER COLUMN "userId" SET NOT NULL;
    END IF;
END $$;

-- Add foreign key constraint (only if not exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name='Transaction_userId_fkey') THEN
        ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
