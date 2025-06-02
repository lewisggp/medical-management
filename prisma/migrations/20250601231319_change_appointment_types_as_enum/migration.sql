/*
  Warnings:

  - You are about to drop the column `description` on the `appointment` table. All the data in the column will be lost.
  - You are about to alter the column `type` on the `appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `description`,
    ADD COLUMN `notes` VARCHAR(191) NULL,
    MODIFY `type` ENUM('GENERAL', 'SPECIALIST', 'EMERGENCY', 'FOLLOW_UP', 'OTHER') NOT NULL DEFAULT 'GENERAL';
