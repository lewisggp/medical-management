/*
  Warnings:

  - Made the column `notes` on table `appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `appointment` MODIFY `notes` VARCHAR(191) NOT NULL;
