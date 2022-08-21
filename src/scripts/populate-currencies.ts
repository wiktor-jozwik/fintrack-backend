import { PrismaService } from '../modules/prisma/prisma.service';
import { SUPPORTED_CURRENCIES } from '../constants/supported-currencies';

export const populateCurrencies = async (prisma?: PrismaService | null) => {
  if (!prisma) {
    prisma = new PrismaService();
  }
  for (const currency of SUPPORTED_CURRENCIES) {
    await prisma.currency.upsert({
      create: currency,
      where: {
        name: currency.name,
      },
      update: {},
    });
    console.log(`Saved ${currency.name}`);
  }
};
