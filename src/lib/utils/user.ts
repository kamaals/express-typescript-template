import type { DB, UserType } from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { logNames } from "@/lib/logger/helper";
import { mainLogger } from "@/lib/logger/winston";
import type { PostgresError } from "postgres";

export const addDefaultUser = async (db: DB, name = "Admin User") => {
  try {
    // @ts-ignore
    return (await db
      .insert(User)
      .values({
        status: "active",
        role: "admin",
        name: name,
        password: "Element@4",
        email: "admin@myapp.app",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()) as unknown as UserType;
  } catch (e: unknown) {
    const error = e as PostgresError;
    mainLogger.error(logNames.db.error, error);
    return null;
  }
};
