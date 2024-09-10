import { getOpenApiRouter } from "@/api/docs/open-api";
import { heartBeat } from "@/api/status/heart-beat";
import { env } from "@/lib/config";
import cors from "cors";
import express from "express";
import type { Application } from "express";
import helmet from "helmet";

export const getServer = (): Application => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(helmet());

  app.use(`/${env.VERSION}/heart-beat`, heartBeat());
  app.use(`/${env.VERSION}/swagger`, getOpenApiRouter());

  return app;
};
