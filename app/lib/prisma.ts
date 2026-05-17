import { PrismaClient } from "../../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient() {
  const url =
    process.env.NODE_ENV === "production"
      ? (process.env.DATABASE_URL_PROD ??
        process.env.DATABASE_URL ??
        "file:./dev.db")
      : (process.env.DATABASE_URL ?? "file:./dev.db");

  if (url.startsWith("libsql://") || url.startsWith("https://")) {
    const adapter = new PrismaLibSql({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  const filePath = url.replace(/^file:/, "");
  const adapter = new PrismaBetterSqlite3({ url: filePath });
  return new PrismaClient({ adapter });
}

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
