-- CreateEnum
CREATE TYPE "ScreeningType" AS ENUM ('HYPERTENSION', 'DIABETES', 'PHQ9', 'GAD7', 'PSYCHOSIS', 'BIPOLAR', 'PTSD', 'OCD', 'SUBSTANCE_USE', 'SUICIDE_RISK', 'DELIRIUM', 'EPILEPSY');

-- CreateEnum
CREATE TYPE "TriageLevel" AS ENUM ('GREEN', 'YELLOW', 'RED');

-- CreateTable
CREATE TABLE "screenings" (
    "id" TEXT NOT NULL,
    "individualId" TEXT NOT NULL,
    "chwId" TEXT NOT NULL,
    "screeningType" "ScreeningType" NOT NULL,
    "responses" JSONB NOT NULL,
    "score" INTEGER,
    "triageLevel" "TriageLevel" NOT NULL,
    "notes" TEXT,
    "voiceNotePath" TEXT,
    "administeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screenings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "screenings_individualId_screeningType_idx" ON "screenings"("individualId", "screeningType");

-- CreateIndex
CREATE INDEX "screenings_chwId_administeredAt_idx" ON "screenings"("chwId", "administeredAt");

-- AddForeignKey
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "individuals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_chwId_fkey" FOREIGN KEY ("chwId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
