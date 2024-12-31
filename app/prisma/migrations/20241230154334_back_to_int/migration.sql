/*
  Warnings:

  - The `savedQuizzes` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "savedQuizzes",
ADD COLUMN     "savedQuizzes" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
