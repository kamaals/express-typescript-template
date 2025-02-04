CREATE SCHEMA "school_schema";
--> statement-breakpoint
CREATE TYPE "school_schema"."roles" AS ENUM('user', 'parent', 'student', 'teacher', 'admin', 'super-admin');--> statement-breakpoint
CREATE TYPE "school_schema"."userStatus" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "school_schema"."grades" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updatedBy" uuid
);
--> statement-breakpoint
CREATE TABLE "school_schema"."student_subjects" (
	"student_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updatedBy" uuid,
	CONSTRAINT "student_subjects_student_id_subject_id_pk" PRIMARY KEY("student_id","subject_id")
);
--> statement-breakpoint
CREATE TABLE "school_schema"."subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"grade_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updatedBy" uuid
);
--> statement-breakpoint
CREATE TABLE "school_schema"."users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" "school_schema"."roles" DEFAULT 'user',
	"email" varchar NOT NULL,
	"phone" text[] DEFAULT ARRAY[]::text[],
	"status" "school_schema"."userStatus",
	"password" varchar NOT NULL,
	"grade_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" uuid,
	"updatedBy" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "school_schema"."student_subjects" ADD CONSTRAINT "student_subjects_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "school_schema"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_schema"."student_subjects" ADD CONSTRAINT "student_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "school_schema"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "school_schema"."subjects" ADD CONSTRAINT "subjects_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "school_schema"."grades"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "school_schema"."users" ADD CONSTRAINT "users_grade_id_grades_id_fk" FOREIGN KEY ("grade_id") REFERENCES "school_schema"."grades"("id") ON DELETE cascade ON UPDATE cascade;