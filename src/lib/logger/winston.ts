import type { MorganMessage } from "@/lib/logger/logger";
import { type LogLevelKeys, colored, getLogger } from "colorful-log-message";
import type { TransformableInfo } from "logform";
import { LEVEL, MESSAGE, SPLAT } from "triple-beam";
import winston, { type LeveledLogMethod } from "winston";
import type { levels } from "@/lib/logger/helper";

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
const transports =
  process.env.NODE_ENV === "test"
    ? []
    : [new winston.transports.Console({ level: "debug" })];

export const mainLogger = winston.createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    success: 4,
    debug: 5,
  },
  transports,
  format,
}) as WLogger & Record<keyof typeof levels, LeveledLogMethod>;
