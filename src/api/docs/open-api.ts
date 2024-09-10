import { generateOpenAPIDocument } from '@/lib/open-api-generator';
import { Router } from 'express';
import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import swaggerUi from "swagger-ui-express";
export const getOpenApiRouter = () => {
  const router = Router();
  const docs = generateOpenAPIDocument();



  router.get('/json', (_, response: Response) => {
    response.setHeader("Content-Type", "application/json");
    response.status(StatusCodes.OK).send(docs);
  });

  router.use("/", swaggerUi.serve, swaggerUi.setup(docs));

  return router;
}
