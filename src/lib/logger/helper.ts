import type http from "node:http";
import type { MorganMessage } from "@/lib/logger/logger";
import { mainLogger } from "@/lib/logger/winston";
import morgan, { type StreamOptions } from "morgan";

export const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  success: 4,
  debug: 5,
};

export const logNames = {
  db: {
    error: "DB ERROR",
    success: "DB SUCCESS",
    info: "DB INFO",
    debug: "DB DEBUG",
    warn: "DB WARNING",
  },
  http: {
    error: "HTTP ERROR",
    success: "HTTP SUCCESS",
    info: "HTTP INFO",
    debug: "HTTP DEBUG",
    warn: "HTTP WARNING",
  },
  validation: {
    success: "VALIDATION SUCCESS",
    error: "VALIDATION ERROR",
    warn: "VALIDATION WARNING",
  },
  app: {
    error: "APP ERROR",
    info: "APP INFO",
    debug: "APP DEBUG",
    warn: "APP WARNING",
  },
};

export const logFormat = `{
    "method": ":method",
    "url": ":url",
    "status": ":status",
    "responseTime": ":response-time ms",
    "body": :body,
    "query": :query,
    "params": :params,
    "remote": "::remote-addr",
    "agent":":user-agent"
}` as string;

export const parseMorganString = (message: string): MorganMessage => {
  try {
    return JSON.parse(message.trim()) as MorganMessage;
  } catch (error) {
    if (error instanceof Error) {
      return {
        message: "Error parsing morgan message to JSON",
        level: "error",
        stack: error.stack,
        name: error.name,
      } as MorganMessage;
    }
    return {
      message: "Error parsing morgan message to JSON",
      level: "error",
    } as MorganMessage;
  }
};

export const extractRequestBody = (request: http.IncomingMessage & { body: Record<string, unknown> }) =>
  request.method === "POST" || request.method === "PUT" ? JSON.stringify(request.body) : "null";

export const extractRequestQuery = (request: http.IncomingMessage & { query: Record<string, unknown> }) =>
  JSON.stringify(request.query);

export const extractRequestParams = (request: http.IncomingMessage & { params: Record<string, unknown> }) =>
  JSON.stringify(request.params);

export const extractValidationErrors = (
  request: http.IncomingMessage & {
    header: Record<"validation_errors", string>;
  },
) => (request.header.validation_errors ? request.header.validation_errors : "{}");

export const streamFunc = (): StreamOptions => {
  return {
    write: (message: string) => {
      const jsonMessage = parseMorganString(message);
      if (jsonMessage.level === "error" || Number.parseInt(jsonMessage.status) > 399) {
        return mainLogger.error(logNames.http.error, { ...jsonMessage, subtitle: "HTTP FROM Morgan" });
      }
      return mainLogger.http(logNames.http.success, {
        ...jsonMessage,
        subtitle: "HTTP",
        level: "success",
      });
    },
  };
};

morgan.token("body", extractRequestBody);
morgan.token("query", extractRequestQuery);
morgan.token("params", extractRequestParams);
morgan.token("validation_errors", extractValidationErrors);
