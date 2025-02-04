import type { DB } from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { hashUserPassword } from "@/lib/utils/auth";
import { reset, seed } from "drizzle-seed";

export const seedUser = async (db: DB) => {
  const hashedPW = await hashUserPassword("P@ssword1");
  await seed<DB, any, any>(db, { User: User }).refine((f) => {
    return {
      User: {
        count: 10,
        columns: {
          password: f.valuesFromArray({
            values: [hashedPW],
          }),
          name: f.fullName(),
          role: f.valuesFromArray({
            values: ["user", "student", "parent", "teacher"],
          }),
          phone: f.phoneNumber({
            prefixes: ["+380 99", "+380 67", "+1"],
            generatedDigitsNumbers: [7, 7, 10],
            arraySize: 3,
          }),
        },
      },
    };
  });
};

export const resetUser = async (db: DB) => {
  await reset(db, { User: User });
};

export const getAllUsers = async (db: DB) => {
  return db.query.User.findMany();
};
