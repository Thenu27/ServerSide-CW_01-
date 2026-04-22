/*
  Warnings:

  - Added the required column `url` to the `Certification` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Degree` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Licence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certification" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Degree" ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Licence" ADD COLUMN     "url" TEXT NOT NULL;
