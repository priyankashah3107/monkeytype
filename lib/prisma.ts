// The concept of a singleton Prisma client in a Next.js application is used to ensure that only one instance of the Prisma client is created and reused throughout the application. This is particularly important in development mode, where hot reloading can cause multiple instances of the Prisma client to be created, potentially exhausting database connections.

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
