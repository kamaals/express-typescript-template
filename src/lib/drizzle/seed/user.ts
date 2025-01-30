import { seed } from "drizzle-seed";
import type { DB } from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { connectDB } from "@/lib/drizzle/db";
import { mainLogger } from "@/lib/logger/winston";

export const seedUser = async () => {
  const db = (await connectDB()) as unknown as DB;
  // @ts-ignore
  await seed(db, { User: User }).refine((f) => {
    return {
      User: {
        count: 20,
        columns: {
          name: f.fullName(),
          role: f.valuesFromArray({
            values: ["user", "owner", "staff"],
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

seedUser()
  .then((e) => {
    mainLogger.success(e);
    process.exit();
  })
  .catch((e) => {
    mainLogger.error(e);
    process.exit();
  });
