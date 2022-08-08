import { hashString } from '../../src/utils/hash-password';
import { CategoryTypeEnum } from '../../src/enums/category-type.enum';
import { PrismaService } from '../../src/modules/prisma/prisma.service';

const seedUsers = async () => {
  const prisma = new PrismaService();
  const password = 'testtest';
  const hashedPassword = await hashString(password);

  const plnCurrency = prisma.currency.findFirst({ where: { name: 'PLN' } });
  const usdCurrency = prisma.currency.findFirst({ where: { name: 'USD' } });

  const userData = [
    {
      email: 'pln@test.com',
      password: hashedPassword,
      userToCurrencies: plnCurrency,
      categories: {
        create: [
          {
            name: 'INCOME_1',
            type: CategoryTypeEnum.INCOME,
            operations: {
              create: [
                {
                  name: 'PLN_INCOME_1',
                  moneyAmount: 55,
                  date: '2022-01-01',
                  currency: plnCurrency,
                },
              ],
            },
          },
          {
            name: 'OUTCOME_1',
            type: CategoryTypeEnum.OUTCOME,
            operations: {
              create: [
                {
                  name: 'PLN_OUTCOME_1',
                  moneyAmount: 44,
                  date: '2022-05-01',
                  currency: plnCurrency,
                },
                {
                  name: 'USD_OUTCOME_1',
                  moneyAmount: 12,
                  date: '2022-05-05',
                  currency: usdCurrency,
                },
              ],
            },
          },
        ],
      },
    },
    {
      email: 'usd@test.com',
      password: hashedPassword,
      userToCurrencies: usdCurrency,
    },
  ];

  for (const user of userData) {
    await prisma.user.create({
      data: user,
    });
  }
};

seedUsers();
