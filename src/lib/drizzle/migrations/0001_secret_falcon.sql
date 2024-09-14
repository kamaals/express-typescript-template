ALTER TABLE "my_schema"."users" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "my_schema"."users" ADD COLUMN "email" varchar NOT NULL;