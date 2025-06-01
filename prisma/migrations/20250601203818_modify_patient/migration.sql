/*
  Warnings:

  - You are about to drop the column `birthDate` on the `patient` table. All the data in the column will be lost.
  - Added the required column `dateOfBirth` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `patient` DROP COLUMN `birthDate`,
    ADD COLUMN `dateOfBirth` DATETIME(3) NOT NULL;
