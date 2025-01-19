/*
  Warnings:

  - Added the required column `enabled` to the `UserConsents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserConsents" ADD COLUMN     "enabled" BOOLEAN NOT NULL;
