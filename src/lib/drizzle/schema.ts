import { env } from "@/lib/config";
import { validatePassword } from "@/lib/utils/password";
import { sql } from "drizzle-orm";
import { pgSchema, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { object, string } from "zod";

export const mySchema = pgSchema(env.DATABASE_NAMESPACE);
export const userStatus = mySchema.enum("userStatus", ["active", "inactive"]);
export const rolesEnum = mySchema.enum("roles", ["user", "owner", "staff", "admin", "super-admin"]);

export const User = mySchema.table("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  role: rolesEnum("role").default("user"),
  email: varchar("email").unique().notNull(),
  phone: text("phone").array().default(sql`ARRAY[]::text[]`),
  status: userStatus("status"),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updatedBy"),
});

export const insertUserSchema = createInsertSchema(User, {
  email: (schema) => schema.email(),
  password: string().min(6),
})
  .strict()
  .superRefine(validatePassword);

export const updateUserSchema = createInsertSchema(User, {
  email: (schema) => schema.email().optional(),
  name: (schema) => schema.optional(),
})
  .omit({ role: true, id: true, password: true })
  .strict();

export const loginSchema = object({
  email: string().email(),
  password: string(),
});

export const putByIDParam = object({
  id: string().uuid(),
});

export const getUserByQuery = object({
  role: string().uuid().optional(),
});

export const registerUserSchema = createInsertSchema(User, {
  email: (schema) => schema.email(),
  password: string().min(6),
})
  .and(
    object({
      confirmPassword: string().min(6),
    }),
  )
  .superRefine(validatePassword)
  .superRefine(({ password, confirmPassword }, ctx) => {
    password === confirmPassword || ctx.addIssue({ code: "custom", message: "password does not match" });
  })
  .superRefine(({ role }, ctx) => {
    if (role) {
      ctx.addIssue({ code: "custom", message: "cannot send role" });
    }
  });
