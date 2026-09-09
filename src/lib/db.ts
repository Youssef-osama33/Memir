import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

let connectionString = process.env.DATABASE_URL;

// If we are in the AI Studio environment with Cloud SQL provisioned:
if (process.env.SQL_HOST && process.env.SQL_USER) {
  const pwd = encodeURIComponent(process.env.SQL_PASSWORD || process.env.SQL_ADMIN_PASSWORD || "");
  const user = process.env.SQL_USER || process.env.SQL_ADMIN_USER;
  const dbName = process.env.SQL_DB_NAME;
  const host = process.env.SQL_HOST; // e.g. /app/cloudsql/...
  connectionString = `postgresql://${user}:${pwd}@localhost/${dbName}?host=${host}&connection_limit=5&pool_timeout=20&connect_timeout=15`;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalThis.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

/**
 * Executes a database operation with automatic retry on transient connection drops (e.g. Cloud SQL idle sleep / E57P01)
 */
export async function withDbRetry<T>(
  operation: (prisma: PrismaClient) => Promise<T>,
  retries = 2
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await operation(db);
    } catch (err: any) {
      attempt++;
      const isConnectionError =
        err?.message?.includes("terminating connection") ||
        err?.message?.includes("57P01") ||
        err?.message?.includes("E57P01") ||
        err?.message?.includes("Connection closed") ||
        err?.code === "P1001" ||
        err?.code === "P1017";

      if (isConnectionError && attempt <= retries) {
        console.warn(`[DB_RETRY] Connection dropped, reconnecting (attempt ${attempt}/${retries})...`);
        try {
          await db.$disconnect();
        } catch {
          // Ignore disconnect error
        }
        // Small backoff before retry
        await new Promise((res) => setTimeout(res, 200 * attempt));
        continue;
      }
      throw err;
    }
  }
  throw new Error("Database operation failed after retries.");
}

