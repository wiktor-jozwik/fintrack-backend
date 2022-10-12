import slugify from 'slugify';

export const slugifyString = (string: string): string => {
  return slugify(string, { lower: true, replacement: '_' });
};
