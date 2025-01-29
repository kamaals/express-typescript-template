import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "@/lib/drizzle/schema";
import postgres from 'postgres';
import { env } from '@/lib/config';
import { WinstonDrizzleLogger } from '@/lib/logger/drizzle';

export const connectDB = async () => {
  const client = postgres(`postgres://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_DOMAIN}:5432/${env.DATABASE}`, { max: 1 });
  return drizzle(client, {schema, logger: new WinstonDrizzleLogger()})
}


