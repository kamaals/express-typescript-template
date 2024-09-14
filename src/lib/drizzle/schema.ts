import { serial, text, pgSchema, varchar } from "drizzle-orm/pg-core";
export const mySchema = pgSchema("my_schema");
export const colors = mySchema.enum('colors', ['red', 'green', 'blue']);

export const UserRepo = mySchema.table('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: varchar("email").notNull(),
  color: colors('color').default('red'),
});
