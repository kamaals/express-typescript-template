import { mainLogger } from "@/lib/logger/winston";
import { APIResponse } from "@/lib/response/response";
import { handleError } from "@/lib/utils/error-handle";
import type { ErrorRequestHandler, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function createErrorResponse<T>(
  response: Response,
  data: T,
  status = StatusCodes.INTERNAL_SERVER_ERROR,
  message = "Error",
) {
  return response.status(status).send(APIResponse.failure(message, data, status));
}

export const expressErrorHandler: ErrorRequestHandler = (err: Error, _: Request, response: Response) => {
  mainLogger.error(err.message);
  createErrorResponse<string>(response, handleError(err));
};
