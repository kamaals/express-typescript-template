import type { ValidateRequestBodyWithZod, ValidateRequestParamWithZod } from "@/@types";
import { createErrorResponse } from "@/lib/services/error";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { mainLogger } from '@/lib/logger/winston';
import getCurrentLine from 'get-current-line';

export const validateRequestBody: ValidateRequestBodyWithZod =
  (schema) => (request: Request, response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request.body);
    if (parsed.success) {
      return next();
    } else {
      const data = parsed.error.errors.map((error) => ({ ...error, field: error.path.join(".") }));
      mainLogger.error("Body is invalid", {message: {
          reason: "Body is invalid",
          data,
          where: getCurrentLine()
        }, subtitle: "Body Validation Middleware"});
      return createErrorResponse(response, data, StatusCodes.BAD_REQUEST, "Request body Validation Error");
    }
  };

export const validateRequestParams: ValidateRequestParamWithZod = (schema) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const parsed = schema.safeParse(request.params);
    if (parsed.success) {
      return next();
    } else {
      const data = parsed.error.errors.map((error) => ({ ...error, field: error.path.join(".") }));
      mainLogger.error("Query is invalid", {message: {
          reason: "Query is invalid",
          data,
          where: getCurrentLine()
        }, subtitle: "Param Validation Middleware"});
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

      const data = parsed.error.errors.map((error) => ({ ...error, field: error.path.join(".") }));
      mainLogger.error("Query is invalid", {message: {
          reason: "Query is invalid",
          data,
          where: getCurrentLine()
        }, subtitle: "Query Validation Middleware"});
      return createErrorResponse(response, data, StatusCodes.NOT_FOUND, "Request Query Validation Error");
    }
  };
