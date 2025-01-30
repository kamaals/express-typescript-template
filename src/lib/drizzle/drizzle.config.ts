import { env } from "@/lib/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
  schema: "./src/lib/drizzle/schema.ts",
  out: "./src/lib/drizzle/migrations",
  dbCredentials: {
    url: `postgres://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_DOMAIN}:5432/${env.DATABASE}`,
  },
});
