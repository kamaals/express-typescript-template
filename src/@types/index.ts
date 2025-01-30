// biome-ignore lint/style/useImportType: <explanation>
import * as schema from "@/lib/drizzle/schema";
import type { getUserByQuery, insertUserSchema, loginSchema } from "@/lib/drizzle/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { Request, RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { JWTPayload } from "jose";
import type { ZodSchema, infer as zInfer } from "zod";

export type ENV = {
  VERSION: string;
  NODE_ENV: string;
  HOST: string;
  PORT: number;
  CORS_ORIGIN: string;
  DATABASE_DOMAIN: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE: string;
  DATABASE_NAMESPACE: string;
  DATABASE_DIALECT: string;
  DATABASE_PORT: number;
  SALT_FACTOR: number;
  PRIVATE_KEY_PATH: string;
};

export type DB = PostgresJsDatabase<typeof schema>;

export type UserInToken = {
  payload: JWTPayload & {
    id: string;
    email: string;
    name: string;
    role: string;
  };
};

export type UserType = zInfer<typeof insertUserSchema>;
export type UserRequest = Request<{ id: string }, unknown, UserType>;
export type UserRequestWithToken = Request<
  { id: string },
  unknown,
  UserType & { decoded?: UserInToken; confirmPassword?: string }
>;
export type UserDelete = Request<{ id: string }, unknown, unknown>;
export type UserQueryRequest = Request<unknown, zInfer<typeof getUserByQuery>, unknown>;

export type LoginRequest = Request<any, any, zInfer<typeof loginSchema>>;

export type ValidateRequestBodyWithZod = <TBody>(
  zodSchema: ZodSchema<TBody>,
) => RequestHandler<ParamsDictionary, any, TBody, any>;

export type ValidateRequestParamWithZod = <TParams>(
  zodSchema: ZodSchema<TParams>,
) => RequestHandler<ParamsDictionary, any, any, any>;
