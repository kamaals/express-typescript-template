import { env } from "@/lib/config";
import * as schema from "@/lib/drizzle/schema";
import { WinstonDrizzleLogger } from "@/lib/logger/drizzle";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const connectDB = async () => {
  const client = postgres(
    `postgres://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_DOMAIN}:5432/${env.DATABASE}`,
    { max: 1 },
  );
  return drizzle(client, {
    schema,
    ...(process.env.NODE_ENV === "test"
      ? {}
      : { logger: new WinstonDrizzleLogger() }),
  });
};
