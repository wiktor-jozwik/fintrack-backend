/*
  Warnings:

  - A unique constraint covering the columns `[name,type,user_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referential_number,origin,id]` on the table `operations` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "categories_name_user_id_key";

-- AlterTable
ALTER TABLE "operations" ADD COLUMN     "origin" TEXT DEFAULT 'MANUAL',
ADD COLUMN     "referential_number" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_type_user_id_key" ON "categories"("name", "type", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "operations_referential_number_origin_id_key" ON "operations"("referential_number", "origin", "id");
