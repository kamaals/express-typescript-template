import { createSuccessResponse, createSuccessResponseForSwagger } from "@/lib/services/success";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import type { Request, Response } from "express";
import type { Router } from "express";
import { StatusCodes } from "http-status-codes";
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

  return heartBeatRegistry;
};

export const heartBeat = (router: Router) => {
  router.get("/heart-beat", (_: Request, response: Response) => {
    return createSuccessResponse<string>(response, "API is running healthy", StatusCodes.OK);
  });
  return router;
};
