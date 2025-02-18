/*
  Warnings:

  - Added the required column `coordinates` to the `Emergency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Emergency" ADD COLUMN     "coordinates" TEXT NOT NULL;
