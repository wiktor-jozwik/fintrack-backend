import { PrismaService } from '@app/database';
import { SUPPORTED_CURRENCIES } from '@app/common/constants';

export const populateCurrencies = async (prisma?: PrismaService | null) => {
  if (!prisma) {
    prisma = new PrismaService();
  }
  for (const currency of SUPPORTED_CURRENCIES) {
    const currencyFound = await prisma.currency.findUnique({
      where: {
        name: currency.name,
      },
    });
    if (currencyFound) {
      continue;
    }

    await prisma.currency.create({
      data: {
        name: currency.name,
        symbol: currency.symbol,
      },
    });
    console.log(`Saved ${currency.name}`);
    // await importCurrencyRatesInRange(currency.name);
  }
};
