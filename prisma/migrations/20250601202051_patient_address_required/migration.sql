/*
  Warnings:

  - Made the column `address` on table `patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `patient` MODIFY `address` VARCHAR(191) NOT NULL;
