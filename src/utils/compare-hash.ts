import * as bcrypt from 'bcrypt';

export const compareHash = async (plainString: string, hash: string) => {
  return await bcrypt.compare(plainString, hash);
};
