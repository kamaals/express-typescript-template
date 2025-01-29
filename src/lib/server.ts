import type { DB } from "@/@types";
import { getApiRouter } from "@/api/";
import { getOpenApiRouter } from "@/api/docs/open-api";
import { API_PATH, SWAGGER_PATH, env } from "@/lib/config";

import { morganMiddleware } from "@/lib/logger/morgan";
import { expressErrorHandler } from "@/lib/services/error";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import type { Application, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";

morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});

export const getServer = (db: DB): Application => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet());
  // @ts-ignore
  app.use(morganMiddleware);
  app.use(API_PATH, getApiRouter(db));
  app.use(API_PATH + SWAGGER_PATH, getOpenApiRouter());

  // biome-ignore lint/complexity/useArrowFunction: <explanation>
  app.all("*", function (_: Request, response: Response) {
    response.status(404).send({
      success: false,
      message: "404",
    });
  });

  app.use(expressErrorHandler);

  return app;
};
