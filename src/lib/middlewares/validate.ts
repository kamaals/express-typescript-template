import type { ValidateRequestBodyWithZod, ValidateRequestParamWithZod } from "@/@types";
import { createErrorResponse } from "@/lib/services/error";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const validateRequestBody: ValidateRequestBodyWithZod =
  (schema) => (request: Request, response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request.body);
    if (parsed.success) {
      return next();
    } else {
      const data = parsed.error.errors.map((error) => ({
        ...error,
        field: error.path.join("."),
      }));

      return createErrorResponse(response, data, StatusCodes.BAD_REQUEST, "Request body Validation Error");
    }
  };

export const validateRequestParams: ValidateRequestParamWithZod = (schema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request.params);
    if (parsed.success) {
      return next();
    } else {
      const data = parsed.error.errors.map((error) => ({
        ...error,
        field: error.path.join("."),
      }));
      return createErrorResponse(response, data, StatusCodes.NOT_FOUND, "Request params Validation Error");
    }
  };
};

export const validateRequestQuery: ValidateRequestParamWithZod =
  (schema) => (request: Request, response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request.query);
    if (parsed.success) {
      return next();
    } else {
      const data = parsed.error.errors.map((error) => ({
        ...error,
        field: error.path.join("."),
      }));
      return createErrorResponse(response, data, StatusCodes.NOT_FOUND, "Request Query Validation Error");
    }
  };
