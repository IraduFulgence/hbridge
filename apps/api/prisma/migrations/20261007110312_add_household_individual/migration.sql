-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "households" (
    "id" TEXT NOT NULL,
    "chwId" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "headName" TEXT NOT NULL,
    "headId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "households_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "individuals" (
    "id" TEXT NOT NULL,
    "householdId" TEXT NOT NULL,
    "nationalId" TEXT,
    "mutuelleId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "age" INTEGER,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender" NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "hasHypertension" BOOLEAN NOT NULL DEFAULT false,
    "hasDiabetes" BOOLEAN NOT NULL DEFAULT false,
    "hasEpilepsy" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "individuals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "individuals_nationalId_key" ON "individuals"("nationalId");

-- AddForeignKey
ALTER TABLE "households" ADD CONSTRAINT "households_chwId_fkey" FOREIGN KEY ("chwId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individuals" ADD CONSTRAINT "individuals_householdId_fkey" FOREIGN KEY ("householdId") REFERENCES "households"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
