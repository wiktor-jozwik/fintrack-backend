// import { Injectable } from '@nestjs/common';
// import { UsersCurrenciesRepository } from '../../../users-currencies/users-currencies.repository';
// import { Category, Currency, Operation } from '@prisma/client';
//
// @Injectable()
// class OperationsCalculatorService {
//   constructor(
//     private readonly usersCurrenciesRepository: UsersCurrenciesRepository,
//   ) {}
//
//   async calculate(
//     operations: (Operation & { currency: Currency; category: Category })[],
//     userId: number,
//   ) {
//     const defaultCurrency =
//       await this.usersCurrenciesRepository.findUsersDefault(userId);
//   }
//
//   private getMoneyValueInDefaultCurrency(
//     operation: Operation & { currency: Currency },
//     defaultCurrency: string,
//   ): number {
//     if (operation.currency.name === defaultCurrency) {
//       return 1;
//     }
//
//     // const operationCurrencyRateForDate = getAvgCurrencyRateForDate(operation.currency.name, operation.date);
//
//     if (operation.currency.name === 'PLN') {
//       // return 1 / currencyRateForDate
//     }
//
//     // const defaultCurrencyRateForDate = getAvgCurrencyRateForDate(defaultCurrencyName, operation.date);
//
//     // return operationCurrencyRateForDate / defaultCurrencyRateForDate
//   }
// }
//
// export default OperationsCalculatorService;
