import { auth } from "@/api/auth/auth";
import { heartBeat } from "@/api/status/heart-beat";
import { user } from "@/api/user/user";
// biome-ignore lint/style/useImportType: <explanation>
import * as schema from "@/lib/drizzle/schema";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js/";
import { Router } from "express";

export const getApiRouter = (db: PostgresJsDatabase<typeof schema>) => {
  const router = Router();
  heartBeat(router);
  user(router, db);
  auth(router, db);

  return router;
};
