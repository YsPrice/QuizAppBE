/*
  Warnings:

  - You are about to drop the column `quizzesTaken` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `savedQuizzes` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "quizzesTaken",
DROP COLUMN "savedQuizzes";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "quizzesTaken" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "savedQuizzes" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
