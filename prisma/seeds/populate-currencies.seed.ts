import { SUPPORTED_CURRENCIES } from '../../src/constants/supported-currencies';
import { PrismaService } from '../../src/modules/prisma/prisma.service';

const populateCurrencies = async () => {
  const prisma = new PrismaService();
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

populateCurrencies();
