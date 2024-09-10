import {z} from "zod";
import { StatusCodes } from 'http-status-codes';

export class APIResponse<K = null> {
  readonly success: boolean;
  readonly message: string;
  readonly responseObject: K;
  readonly statusCode: number;

  private constructor(success: boolean, message: string, responseObject: K, statusCode: number) {
    this.success = success;
    this.message = message;
    this.responseObject = responseObject;
    this.statusCode = statusCode;
  }

  static success<K>(message: string, responseObject: K, statusCode: number = StatusCodes.OK) {
    return new APIResponse(true, message, responseObject, statusCode);
  }

  static failure<K>(message: string, responseObject: K, statusCode: StatusCodes.BAD_REQUEST) {
    return new APIResponse(false, message, responseObject, statusCode);
  }
}

export const ResponseSchema = <K extends z.ZodTypeAny>(dataSchema: K) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    responseObject: dataSchema.optional(),
    statusCode: z.number(),
  });
