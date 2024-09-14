CREATE SCHEMA "my_schema";
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "my_schema"."colors" AS ENUM('red', 'green', 'blue');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "my_schema"."users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"color" "my_schema"."colors" DEFAULT 'red'
);
