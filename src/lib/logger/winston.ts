import { getDebugLog, getErrorLog, getInfoLog, getSuccessLog, getWarnLog, levels } from "@/lib/logger/helper";
import type { MorganMessage } from "@/lib/logger/logger";

import type { TransformableInfo } from "logform";
import { LEVEL, MESSAGE, SPLAT } from "triple-beam";
import winston, { type LeveledLogMethod } from "winston";

type WLogger = winston.Logger;

const prettyPrintWithColor = () =>
  winston.format.printf((message: TransformableInfo) => {
    const stripped = Object.assign({}, message) as MorganMessage & {
      [LEVEL]: unknown;
      [MESSAGE]: unknown;
      [SPLAT]: unknown;
    };

    delete stripped[LEVEL];
    delete stripped[MESSAGE];
    delete stripped[SPLAT];

    if (stripped.method === "GET" || stripped.method === "DELETE") {
      // biome-ignore lint/performance/noDelete: <explanation>
      delete stripped.body;
    }
    switch (stripped.level) {
      case "error":
        return getErrorLog(stripped);
      case "success":
        return getSuccessLog(stripped);
      case "warn":
        return getWarnLog(stripped);
      case "debug":
        return getDebugLog(stripped);
      default:
        return getInfoLog(stripped);
    }
  });

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  prettyPrintWithColor(),
);

const transports = [
  new winston.transports.Console({ level: "debug" }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

export const mainLogger = winston.createLogger({
  levels,
  transports,
  format,
}) as WLogger & Record<keyof typeof levels, LeveledLogMethod>;
