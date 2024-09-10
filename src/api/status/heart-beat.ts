import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type {  Request,  Response } from "express";
import {Router} from "express";
import { createSuccessResponse, createSuccessResponseForSwagger } from '@/lib/services/success';
import { z } from "zod";

export const heartBeat = () => {
  const healthCheckRegistry = new OpenAPIRegistry();

  healthCheckRegistry.registerPath({
    method: "get",
    path: "/heart-beat",
    tags: ["Health Check"],
    responses: createSuccessResponseForSwagger(z.null()),
  });

  const router = Router();
  router.get("/", (_: Request, res: Response) => {
    return createSuccessResponse(res, 'API is running healthy');
  });
  return router;
}
