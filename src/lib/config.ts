import type { ENV } from "@/@types";
import dotenv from "dotenv";
import { cleanEnv, host, port, str, testOnly } from "envalid";
import { version } from "../../package.json";
dotenv.config();

export const env: ENV = cleanEnv(process.env, {
  VERSION: str({ devDefault: version }),
  NODE_ENV: str({ devDefault: testOnly("test"), choices: ["development", "production", "test"] }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  CORS_ORIGIN: str({ devDefault: testOnly("http://localhost:3000") }),
});
