/*
  Warnings:

  - Made the column `mileage` on table `MotorcycleDetails` required. This step will fail if there are existing NULL values in that column.
  - Made the column `engineSize` on table `MotorcycleDetails` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Brand" ADD VALUE 'KYT';

-- AlterTable
ALTER TABLE "MotorcycleDetails" ALTER COLUMN "mileage" SET NOT NULL,
ALTER COLUMN "engineSize" SET NOT NULL;
