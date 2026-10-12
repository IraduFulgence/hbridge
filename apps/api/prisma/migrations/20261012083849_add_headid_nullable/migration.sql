/*
  Warnings:

  - A unique constraint covering the columns `[headId]` on the table `households` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "households" ALTER COLUMN "headId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "households_headId_key" ON "households"("headId");
