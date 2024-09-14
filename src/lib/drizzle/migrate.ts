import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '@/lib/config';

export const connectDB = async () => {

  const migrationClient = postgres(`postgres://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_DOMAIN}:5432/${env.DATABASE}`, { max: 1 });
  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./src/lib/drizzle/migrations"
  })

  await migrationClient.end()
}

connectDB().catch(console.log)
