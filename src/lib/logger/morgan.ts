import type http from "node:http";
import { logFormat, streamFunc } from "@/lib/logger/helper";
import morgan from "morgan";

export const morganMiddleware = morgan<
  http.IncomingMessage & {
    body: Record<string, unknown>;
    query: Record<string, unknown>;
    params: Record<string, unknown>;
    header: Record<"validation_errors", string>;
  },
  http.ServerResponse
  // @ts-ignore
>(logFormat, {
  stream: streamFunc(),
  skip: () => process.env.NODE_ENV === "test",
});
