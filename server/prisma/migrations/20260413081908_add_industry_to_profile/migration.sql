/*
  Warnings:

  - Added the required column `industrySector` to the `EmploymentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmploymentHistory" ADD COLUMN     "industrySector" TEXT NOT NULL;
