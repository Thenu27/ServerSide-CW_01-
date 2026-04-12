/*
  Warnings:

  - You are about to drop the column `accessedAt` on the `ApiUsageLog` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `ApiUsageLog` table. All the data in the column will be lost.
  - You are about to drop the column `statusCode` on the `ApiUsageLog` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ApiClient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiClientId` to the `ApiUsageLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ApiUsageLog" DROP CONSTRAINT "ApiUsageLog_clientId_fkey";

-- DropIndex
DROP INDEX "ApiUsageLog_accessedAt_idx";

-- DropIndex
DROP INDEX "ApiUsageLog_clientId_idx";

-- AlterTable
ALTER TABLE "ApiClient" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ApiUsageLog" DROP COLUMN "accessedAt",
DROP COLUMN "clientId",
DROP COLUMN "statusCode",
ADD COLUMN     "apiClientId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "endpoint" DROP NOT NULL,
ALTER COLUMN "method" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ApiClient" ADD CONSTRAINT "ApiClient_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiUsageLog" ADD CONSTRAINT "ApiUsageLog_apiClientId_fkey" FOREIGN KEY ("apiClientId") REFERENCES "ApiClient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
