import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from '@/lib/config';
import { heartBeat } from '@/api/status/heart-beat';
import { getOpenApiRouter } from '@/api/docs/open-api';

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
