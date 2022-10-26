/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `currencies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[symbol]` on the table `currencies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "currencies_name_key" ON "currencies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "currencies_symbol_key" ON "currencies"("symbol");
