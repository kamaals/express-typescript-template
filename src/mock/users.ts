import type { DB } from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { hashUserPassword } from "@/lib/utils/auth";

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

export const clearAllUsers = async (db: DB) =>
  typeof db.delete === "function" && (await db.delete(User));

export const insertAllUsers = async (db: DB) => {
  await clearAllUsers(db);
  return (
    await Promise.all(
      MOCK_USERS.map(
        async (u) =>
          typeof db.insert === "function" &&
          (await db
            .insert(User)
            // @ts-ignore
            .values({
              ...u,
              role: "user",
              password: await hashUserPassword(u.password),
            })
            .returning()),
      ),
    )
  ).flat();
};
