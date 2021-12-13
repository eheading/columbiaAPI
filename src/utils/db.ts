import { PrismaClient } from '@prisma/client';

// you could add options here such as logging and middleware if you needed to use.
export const db = new PrismaClient();
