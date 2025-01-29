CREATE SCHEMA "app_schema";
--> statement-breakpoint
CREATE TYPE "app_schema"."roles" AS ENUM('user', 'owner', 'staff', 'admin', 'super-admin');--> statement-breakpoint
CREATE TYPE "app_schema"."userStatus" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "app_schema"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" "app_schema"."roles" DEFAULT 'user',
	"email" varchar NOT NULL,
	"phone" text[] DEFAULT '{}',
	"status" "app_schema"."userStatus",
	"password" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updatedBy" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
