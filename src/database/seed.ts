import { hashString } from '../utils/hash-password';
import { CategoryType } from '../enums/category-type.enum';
import { PrismaService } from '../modules/prisma/prisma.service';
import { populateCurrencies } from '../scripts/populate-currencies';

const seedUsers = async () => {
  const prisma = new PrismaService();
  await populateCurrencies(prisma);
  const password = 'testtest';
  const hashedPassword = await hashString(password);

  const plnCurrency = await prisma.currency.findFirstOrThrow({
    where: { name: 'PLN' },
  });
  const usdCurrency = await prisma.currency.findFirstOrThrow({
    where: { name: 'USD' },
  });
  const euroCurrency = await prisma.currency.findFirstOrThrow({
    where: { name: 'EUR' },
  });

  await prisma.user.create({
    data: {
      email: 'pln@test.com',
      password: hashedPassword,
      categories: {
        create: {
          name: 'INCOME_PLN',
          type: CategoryType.INCOME,
          operations: {
            createMany: {
              data: [
                {
                  name: 'Salary',
                  date: new Date('2022-01-01'),
                  moneyAmount: 55,
                  currencyId: plnCurrency.id,
                },
                {
                  name: 'Salary',
                  date: new Date('2022-05-01'),
                  moneyAmount: 128,
                  currencyId: plnCurrency.id,
                },
              ],
            },
          },
        },
      },
      usersToCurrencies: {
        createMany: {
          data: [
            {
              currencyId: plnCurrency.id,
            },
            {
              currencyId: euroCurrency.id,
            },
          ],
        },
      },
      firstName: 'pln',
      lastName: 'test',
      phoneNumber: '346246242',
    },
  });

  await prisma.user.create({
    data: {
      email: 'usd@test.com',
      password: hashedPassword,
      categories: {
        createMany: {
          data: [
            {
              name: 'USD_INCOME_1',
              type: CategoryType.INCOME,
            },
            {
              name: 'USD_INCOME_2',
              type: CategoryType.INCOME,
            },
            {
              name: 'USD_OUTCOME',
              type: CategoryType.OUTCOME,
            },
          ],
        },
      },
      usersToCurrencies: {
        create: {
          currencyId: usdCurrency.id,
        },
      },
      firstName: 'usd',
      lastName: 'test',
      phoneNumber: '234235235',
    },
  });
};

seedUsers();