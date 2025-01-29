import { env } from "@/lib/config";
import * as schema from "@/lib/drizzle/schema";
import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const getClientAndDB = async () => {
  const container = await new PostgreSqlContainer("postgres:alpine")
    .withDatabase(env.DATABASE)
    .withPassword(env.DATABASE_PASSWORD)
    .withUsername(env.DATABASE_USER)
    .withExposedPorts(env.DATABASE_PORT)
    .withDefaultLogDriver()
    .start();

  const URL = `postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${container.getHost()}:${env.DATABASE_PORT}/${env.DATABASE}`;
  const client = postgres(URL, { max: 1 });
  const db = drizzle(client, { schema, logger: false });

  return { db, client, container };
};
