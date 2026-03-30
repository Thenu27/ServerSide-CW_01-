-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "status" "BidStatus" NOT NULL DEFAULT 'ACTIVE';
