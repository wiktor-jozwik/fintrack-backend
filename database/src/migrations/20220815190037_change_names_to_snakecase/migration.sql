/*
  Warnings:

  - You are about to drop the column `userId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `operations` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `operations` table. All the data in the column will be lost.
  - You are about to drop the column `moneyAmount` on the `operations` table. All the data in the column will be lost.
  - The primary key for the `user_to_currencies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `user_to_currencies` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `user_to_currencies` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_to_currencies` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,user_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `operations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_id` to the `operations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `money_amount` to the `operations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency_id` to the `user_to_currencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_to_currencies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_userId_fkey";

-- DropForeignKey
ALTER TABLE "operations" DROP CONSTRAINT "operations_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "operations" DROP CONSTRAINT "operations_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "user_to_currencies" DROP CONSTRAINT "user_to_currencies_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "user_to_currencies" DROP CONSTRAINT "user_to_currencies_userId_fkey";

-- DropIndex
DROP INDEX "categories_name_userId_key";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "operations" DROP COLUMN "categoryId",
DROP COLUMN "currencyId",
DROP COLUMN "moneyAmount",
ADD COLUMN     "category_id" INTEGER NOT NULL,
ADD COLUMN     "currency_id" INTEGER NOT NULL,
ADD COLUMN     "money_amount" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "user_to_currencies" DROP CONSTRAINT "user_to_currencies_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "currencyId",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_to_currencies_pkey" PRIMARY KEY ("currency_id", "user_id");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "lastName",
DROP COLUMN "phoneNumber",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "phone_number" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_user_id_key" ON "categories"("name", "user_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operations" ADD CONSTRAINT "operations_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_to_currencies" ADD CONSTRAINT "user_to_currencies_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_to_currencies" ADD CONSTRAINT "user_to_currencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
