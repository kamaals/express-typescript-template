import type { DB } from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { getAllUsers, resetUser, seedUser } from "@/lib/drizzle/seed/user";
import { connectDB } from "@/lib/drizzle/db";

export const clearAllUsers = async (db: DB) =>
  typeof db.delete === "function" && (await db.delete(User));

export const insertAllUsers = async (db: DB) => {
  await clearAllUsers(db);
  await resetUser(db);
  await seedUser(db);
  return getAllUsers(db);
};

(async () => {
  const db = (await connectDB()) as unknown as DB;
  await seedUser(db);
})();
