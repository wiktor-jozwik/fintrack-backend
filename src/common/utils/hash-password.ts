import * as bcrypt from 'bcrypt';

export const hashString = async (
  string: string,
  salt = 10,
): Promise<string> => {
  return await bcrypt.hash(string, salt);
};
