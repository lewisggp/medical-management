/*
  Warnings:

  - You are about to drop the column `reason` on the `appointment` table. All the data in the column will be lost.
  - Added the required column `description` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `reason`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
