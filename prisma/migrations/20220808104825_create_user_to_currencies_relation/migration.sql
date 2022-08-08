-- AlterTable
ALTER TABLE "Currency" ALTER COLUMN "name" SET DATA TYPE TEXT,
ALTER COLUMN "symbol" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Operation" ALTER COLUMN "date" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserToCurrencies" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "currencyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserToCurrencies_pkey" PRIMARY KEY ("currencyId","userId")
);

-- AddForeignKey
ALTER TABLE "UserToCurrencies" ADD CONSTRAINT "UserToCurrencies_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserToCurrencies" ADD CONSTRAINT "UserToCurrencies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
