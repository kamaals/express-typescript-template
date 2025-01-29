import { levels } from "@/lib/logger/helper";
import type { MorganMessage } from "@/lib/logger/logger";
import type { TransformableInfo } from "logform";
import { LEVEL, MESSAGE, SPLAT } from "triple-beam";
import winston, { type LeveledLogMethod } from "winston";
import { colored, getLogger, type LogLevelKeys } from "colorful-log-message";

type WLogger = winston.Logger;

export const colorfulLogger = getLogger(colored, "bullet-train");

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
    return colorfulLogger({
      level: message.level as LogLevelKeys,
      message: stripped,
      subtitle: stripped.subtitle ?? "APP",
    });
  });

const format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  prettyPrintWithColor(),
);

/*
 Create winston transporter
 ex: create winston transporter for better stack
 */
const transports = [new winston.transports.Console({ level: "debug" })];

export const mainLogger = winston.createLogger({
  levels,
  transports,
  format,
}) as WLogger & Record<keyof typeof levels, LeveledLogMethod>;
