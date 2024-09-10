import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type {  Request,  Response } from "express";
import {Router} from "express";
import { createSuccessResponse, createSuccessResponseForSwagger } from '@/lib/services/success';
import { z } from "zod";

/*
 * This function creates a new OpenAPIRegistry and registers a path for the
 * swagger UI
 */
export const getHeartBeatRegistry = () => {
  const heartBeatRegistry = new OpenAPIRegistry();

  heartBeatRegistry.registerPath({
    method: "get",
    path: "/heart-beat",
    tags: ["Heart Beat"],
    responses: createSuccessResponseForSwagger(z.null()),
  });

  return heartBeatRegistry
}

export const heartBeat = () => {
  const router = Router();
  router.get("/", (_: Request, res: Response) => {
    return createSuccessResponse(res, 'API is running healthy');
  });
  return router;
}
