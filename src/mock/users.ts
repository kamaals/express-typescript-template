import type { DB } from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { getAllUsers, resetUser, seedUser } from "@/lib/drizzle/seed/user";

export const MOCK_USERS = [
  {
    email: "user1@email.com",
    name: "John 1 Doe",
    password: "Hello@#1235",
  },
  {
    email: "user2@email.com",
    name: "John 2 Doe",
    password: "Hello@#1235",
  },
  {
    email: "user3@email.com",
    name: "John 3 Doe",
    password: "Hello@#1235",
  },
  {
    email: "user4@email.com",
    name: "John 4 Doe",
    password: "Hello@#1235",
  },
];

export const clearAllUsers = async (db: DB) => typeof db.delete === "function" && (await db.delete(User));

export const insertAllUsers = async (db: DB) => {
  await clearAllUsers(db);
  await resetUser(db);
  await seedUser(db);
  return getAllUsers(db);
};
