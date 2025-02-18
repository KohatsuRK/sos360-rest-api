import { UserType } from '@prisma/client';

export type UserResponse = {
  id: string;
  email: string;
  name: string;
  type: UserType;
  cpf?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
};
