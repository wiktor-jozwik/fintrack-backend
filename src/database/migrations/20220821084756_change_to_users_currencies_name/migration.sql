/*
  Warnings:

  - You are about to drop the `user_to_currencies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "user_to_currencies" DROP CONSTRAINT "user_to_currencies_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "user_to_currencies" DROP CONSTRAINT "user_to_currencies_user_id_fkey";

-- DropTable
DROP TABLE "user_to_currencies";

-- CreateTable
CREATE TABLE "users_currencies" (
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currency_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "users_currencies_pkey" PRIMARY KEY ("currency_id","user_id")
);

-- AddForeignKey
ALTER TABLE "users_currencies" ADD CONSTRAINT "users_currencies_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_currencies" ADD CONSTRAINT "users_currencies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
