/*
  Warnings:

  - Added the required column `allergies` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bloodType` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicalHistory` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patient` ADD COLUMN `allergies` VARCHAR(191) NOT NULL,
    ADD COLUMN `bloodType` VARCHAR(191) NOT NULL,
    ADD COLUMN `medicalHistory` VARCHAR(191) NOT NULL;
