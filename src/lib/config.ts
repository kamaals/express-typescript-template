import type { ENV } from "@/@types";
import dotenv from "dotenv";
import { cleanEnv, host, num, port, str, testOnly } from "envalid";
// @ts-ignore
import { version } from "../../package.json";

dotenv.config();

export const env: ENV = cleanEnv(process.env, {
  VERSION: str({ devDefault: version }),
  NODE_ENV: str({
    devDefault: testOnly("test"),
    choices: ["development", "production", "test"],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
  DATABASE_DOMAIN: str({ devDefault: "localhost" }),
  DATABASE_USER: str({ devDefault: "admin" }),
  DATABASE_PASSWORD: str({ devDefault: "mypassword" }),
  DATABASE: str({ devDefault: "reward_fu" }),
  DATABASE_NAMESPACE: str({ devDefault: "reward_fu" }),
  DATABASE_DIALECT: str({ devDefault: "postgres" }),
  DATABASE_PORT: port({ devDefault: 5432 }),
  SALT_FACTOR: num({ devDefault: 10 }),
  PRIVATE_KEY_PATH: str({ devDefault: "private.pem" }),
});

export const DB_URL = `postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_DOMAIN}:${env.DATABASE_PORT}/${env.DATABASE}`;
export const SWAGGER_PATH = "docs";
export const API_PATH = `/api/${env.VERSION}/`;
