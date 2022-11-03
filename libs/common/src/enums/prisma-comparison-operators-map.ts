import { comparisonOperators } from '@app/common/enums/comparison-operators';

export const prismaComparisonOperatorsMap: Record<
  typeof comparisonOperators[number],
  string
> = {
  '<': 'lt',
  '<=': 'lte',
  '>': 'gt',
  '>=': 'gte',
  '=': 'equals',
};
