import { env } from "@/lib/config";
import { validatePassword } from "@/lib/utils/password";
import { sql, relations } from "drizzle-orm";
import {
  pgSchema,
  text,
  timestamp,
  uuid,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { object, string } from "zod";

export const mySchema = pgSchema(env.DATABASE_NAMESPACE);
export const userStatus = mySchema.enum("userStatus", ["active", "inactive"]);
export const rolesEnum = mySchema.enum("roles", [
  "user",
  "parent",
  "student",
  "teacher",
  "admin",
  "super-admin",
]);

export const User = mySchema.table("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  role: rolesEnum("role").default("user"),
  email: varchar("email").unique().notNull(),
  phone: text("phone")
    .array()
    .default(sql`ARRAY[]::text[]`),
  status: userStatus("status"),
  password: varchar("password").notNull(),
  gradeId: uuid("grade_id").references(() => Grade.id, {
    onDelete: "cascade",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updatedBy"),
});

export const userRelation = relations(User, ({ one, many }) => ({
  subjects: many(StudentSubject),
  grade: one(Grade, { fields: [User.gradeId], references: [Grade.id] }),
}));

export const Grade = mySchema.table("grades", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updatedBy"),
});

export const Subject = mySchema.table("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  gradeId: uuid("grade_id")
    .notNull()
    .references(() => Grade.id, { onDelete: "cascade", onUpdate: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  createdBy: uuid("created_by"),
  updatedBy: uuid("updatedBy"),
});

export const subjectRelation = relations(Subject, ({ one, many }) => ({
  students: many(StudentSubject),
  grade: one(Grade, { fields: [Subject.gradeId], references: [Grade.id] }),
}));

export const StudentSubject = mySchema.table(
  "student_subjects",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => User.id),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => Subject.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by"),
    updatedBy: uuid("updatedBy"),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.studentId, t.subjectId] }),
  }),
);

export const studentSubjectRelation = relations(StudentSubject, ({ one }) => ({
  student: one(User, {
    fields: [StudentSubject.studentId],
    references: [User.id],
  }),
  subject: one(Subject, {
    fields: [StudentSubject.subjectId],
    references: [Subject.id],
  }),
}));

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
    password === confirmPassword ||
      ctx.addIssue({ code: "custom", message: "password does not match" });
  })
  .superRefine(({ role }, ctx) => {
    if (role) {
      ctx.addIssue({ code: "custom", message: "cannot send role" });
    }
  });
// 4840eee2-25eb-4d8c-25cb-1dc0a72095b5
// b8c21d48-db6a-4729-b74c-001d3fc61d29
