import { PrismaService } from '../modules/prisma/prisma.service';
import { SUPPORTED_CURRENCIES } from '../constants/supported-currencies';

export const populateCurrencies = async (prisma?: PrismaService | null) => {
  if (!prisma) {
    prisma = new PrismaService();
  }
  for (const currency of SUPPORTED_CURRENCIES) {
    const existingCurrency = await prisma.currency.findFirst({
      where: { name: currency.name },
    });

    if (existingCurrency) {
      continue;
    }

    await prisma.currency.create({
      data: currency,
    });
    console.log(`Saved ${currency.name}`);
  }
};
