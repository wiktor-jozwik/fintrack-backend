import { User } from '@prisma/client';

export const userStub = (): User => {
  return {
    id: 3,
    email: 'test@test.com',
    isActive: true,
    createdAt: new Date('2022-05-05'),
    firstName: 'Test',
    lastName: 'tseT',
    passwordHash: 'some hash',
    refreshTokenHash: 'some hash',
    phoneNumber: '123456789',
    updatedAt: new Date('2022-05-05'),
  };
};
