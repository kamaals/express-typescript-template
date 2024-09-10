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

function createSuccessResponse<T>(response: Response, data: T) {
  return response.status(StatusCodes.OK).send(APIResponse.success("Success", data));
}

export { createSuccessResponseForSwagger, createSuccessResponse };
