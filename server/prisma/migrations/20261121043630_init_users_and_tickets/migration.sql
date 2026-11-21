/*
  Warnings:

  - You are about to drop the column `customeName` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `customerName` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "customeName",
ADD COLUMN     "customerName" TEXT NOT NULL;
