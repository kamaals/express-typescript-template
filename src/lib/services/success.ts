import { APIResponse, ResponseSchema } from "@/lib/response/response";
import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";

function createSuccessResponseForSwagger(data: z.ZodTypeAny) {
  return {
    [StatusCodes.OK]: {
      description: "Success response",
      content: {
        "application/json": {
          schema: ResponseSchema(data),
        },
      },
    },
  };
}
/*
 * TODO: Fix logger message format
 */
function createSuccessResponse<T>(response: Response, data: T, status = StatusCodes.OK, message = "Success") {
  return response.status(status).send(APIResponse.success(message, data, status));
}

export { createSuccessResponseForSwagger, createSuccessResponse };
