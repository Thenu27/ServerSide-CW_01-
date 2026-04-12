/*
  Warnings:

  - You are about to drop the column `month` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Bid` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `FeaturedAlumnus` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `FeaturedAlumnus` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,bidDate]` on the table `Bid` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[date]` on the table `FeaturedAlumnus` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bidDate` to the `Bid` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `FeaturedAlumnus` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Bid_month_year_idx";

-- DropIndex
DROP INDEX "Bid_userId_month_year_key";

-- DropIndex
DROP INDEX "FeaturedAlumnus_month_year_key";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "bidDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FeaturedAlumnus" DROP COLUMN "month",
DROP COLUMN "year",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "AlumniEventParticipation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "bonusUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlumniEventParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiClient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsageLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusCode" INTEGER,

    CONSTRAINT "ApiUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlumniEventParticipation_userId_eventDate_idx" ON "AlumniEventParticipation"("userId", "eventDate");

-- CreateIndex
CREATE UNIQUE INDEX "ApiClient_apiKey_key" ON "ApiClient"("apiKey");

-- CreateIndex
CREATE INDEX "ApiUsageLog_clientId_idx" ON "ApiUsageLog"("clientId");

-- CreateIndex
CREATE INDEX "ApiUsageLog_accessedAt_idx" ON "ApiUsageLog"("accessedAt");

-- CreateIndex
CREATE INDEX "Bid_bidDate_idx" ON "Bid"("bidDate");

-- CreateIndex
CREATE UNIQUE INDEX "Bid_userId_bidDate_key" ON "Bid"("userId", "bidDate");

-- CreateIndex
CREATE UNIQUE INDEX "FeaturedAlumnus_date_key" ON "FeaturedAlumnus"("date");

-- AddForeignKey
ALTER TABLE "AlumniEventParticipation" ADD CONSTRAINT "AlumniEventParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageLog" ADD CONSTRAINT "ApiUsageLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "ApiClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
