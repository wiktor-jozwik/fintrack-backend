-- CreateTable
CREATE TABLE "currency_rates" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "avg_value" DOUBLE PRECISION NOT NULL,
    "currency_id" INTEGER NOT NULL,

    CONSTRAINT "currency_rates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currency_rates_date_currency_id_key" ON "currency_rates"("date", "currency_id");

-- AddForeignKey
ALTER TABLE "currency_rates" ADD CONSTRAINT "currency_rates_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
