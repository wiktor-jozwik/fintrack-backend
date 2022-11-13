import { comparisonOperators } from './comparison-operators';

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
