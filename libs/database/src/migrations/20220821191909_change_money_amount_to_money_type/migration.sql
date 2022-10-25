/*
  Warnings:

  - Changed the type of `money_amount` on the `operations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "operations" DROP COLUMN "money_amount",
ADD COLUMN     "money_amount" MONEY NOT NULL;
