/*
  Warnings:

  - Added the required column `reason` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `reason` VARCHAR(191) NOT NULL;
