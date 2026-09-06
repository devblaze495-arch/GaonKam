/*
  Warnings:

  - You are about to drop the column `additionalRequirements` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `expectedDurationHours` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `jobDate` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `wageInformation` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `confirmationStatus` on the `JobAssignment` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedAt` on the `JobAssignment` table. All the data in the column will be lost.
  - You are about to drop the `Completion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompletionConfirmation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JobAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "WageType" AS ENUM ('DAILY', 'HOURLY', 'FIXED', 'NEGOTIABLE');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'BUSY', 'UNAVAILABLE');

-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Completion" DROP CONSTRAINT "Completion_markedCompletedById_fkey";

-- DropForeignKey
ALTER TABLE "CompletionConfirmation" DROP CONSTRAINT "CompletionConfirmation_completionId_fkey";

-- DropForeignKey
ALTER TABLE "CompletionConfirmation" DROP CONSTRAINT "CompletionConfirmation_userId_fkey";

-- DropIndex
DROP INDEX "JobAssignment_jobId_idx";

-- DropIndex
DROP INDEX "JobAssignment_workerId_idx";

-- AlterTable
ALTER TABLE "Dispute" ADD COLUMN     "assignmentId" UUID;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "additionalRequirements",
DROP COLUMN "category",
DROP COLUMN "expectedDurationHours",
DROP COLUMN "jobDate",
DROP COLUMN "location",
DROP COLUMN "wageInformation",
ADD COLUMN     "categoryId" UUID NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "estimatedDurationMinutes" INTEGER,
ADD COLUMN     "isWageNegotiable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "longitude" DECIMAL(9,6),
ADD COLUMN     "transportNotes" TEXT,
ADD COLUMN     "wageAmount" DECIMAL(10,2),
ADD COLUMN     "wageNotes" TEXT,
ADD COLUMN     "wageType" "WageType" NOT NULL DEFAULT 'NEGOTIABLE',
ADD COLUMN     "workDate" DATE;

-- AlterTable
ALTER TABLE "JobAssignment" DROP COLUMN "confirmationStatus",
DROP COLUMN "confirmedAt",
ADD COLUMN     "acceptedAt" TIMESTAMPTZ(3),
ADD COLUMN     "cancelledAt" TIMESTAMPTZ(3),
ADD COLUMN     "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "declinedAt" TIMESTAMPTZ(3),
ADD COLUMN     "noShowAt" TIMESTAMPTZ(3),
ADD COLUMN     "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMPTZ(3) NOT NULL;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "longitude" DECIMAL(9,6);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "latitude" DECIMAL(9,6),
ADD COLUMN     "longitude" DECIMAL(9,6);

-- DropTable
DROP TABLE "Completion";

-- DropTable
DROP TABLE "CompletionConfirmation";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "UserAvailability" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "UserAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCategory" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "JobCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCompletion" (
    "id" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "markedById" UUID NOT NULL,
    "status" "CompletionStatus" NOT NULL DEFAULT 'PENDING',
    "markedAt" TIMESTAMPTZ(3),
    "workerConfirmedAt" TIMESTAMPTZ(3),
    "posterConfirmedAt" TIMESTAMPTZ(3),
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "JobCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAvailability_userId_key" ON "UserAvailability"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JobCategory_name_key" ON "JobCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "JobCompletion_assignmentId_key" ON "JobCompletion"("assignmentId");

-- CreateIndex
CREATE INDEX "JobCompletion_jobId_idx" ON "JobCompletion"("jobId");

-- CreateIndex
CREATE INDEX "JobCompletion_markedById_idx" ON "JobCompletion"("markedById");

-- CreateIndex
CREATE INDEX "JobCompletion_status_idx" ON "JobCompletion"("status");

-- CreateIndex
CREATE INDEX "Dispute_assignmentId_idx" ON "Dispute"("assignmentId");

-- CreateIndex
CREATE INDEX "Job_categoryId_idx" ON "Job"("categoryId");

-- CreateIndex
CREATE INDEX "Job_workDate_idx" ON "Job"("workDate");

-- CreateIndex
CREATE INDEX "JobAssignment_jobId_status_idx" ON "JobAssignment"("jobId", "status");

-- CreateIndex
CREATE INDEX "JobAssignment_workerId_status_idx" ON "JobAssignment"("workerId", "status");

-- AddForeignKey
ALTER TABLE "UserAvailability" ADD CONSTRAINT "UserAvailability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "JobCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCompletion" ADD CONSTRAINT "JobCompletion_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "JobAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCompletion" ADD CONSTRAINT "JobCompletion_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCompletion" ADD CONSTRAINT "JobCompletion_markedById_fkey" FOREIGN KEY ("markedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "JobAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
