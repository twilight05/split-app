-- Fix Wallet table timestamps
-- First, add columns with default values
ALTER TABLE "Wallet" 
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have proper timestamps
UPDATE "Wallet" SET 
  "createdAt" = CURRENT_TIMESTAMP,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;
