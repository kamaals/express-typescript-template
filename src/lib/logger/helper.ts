import type http from "node:http";
import { inspect } from "node:util";
import type { ColorBuilderFunc, MessageBuilderFunc, MorganMessage, SegmentFunc } from "@/lib/logger/logger";
import { mainLogger } from "@/lib/logger/winston";
import { isUnicodeSupported } from "@/lib/logger/unicode-support";
import { TZDate } from "@date-fns/tz";
import chalk from "chalk";
import { format as dateFormat } from "date-fns";
import morgan, { type StreamOptions } from "morgan";

export const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  success: 4,
  debug: 5,
};

const logNames = {
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
    "agent":":user-agent",
    "validation": :validation_errors
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
  request: http.IncomingMessage & { header: Record<"validation_errors", string> },
) => (request.header.validation_errors ? request.header.validation_errors : "{}");

export const streamFunc = (): StreamOptions => {
  return {
    write: (message: string) => {
      const jsonMessage = parseMorganString(message);
      if (jsonMessage.level === "error" || Number.parseInt(jsonMessage.status) > 399) {
        return mainLogger.error(logNames.http.error, jsonMessage.message);
      }
      return mainLogger.http(logNames.http.success, { ...jsonMessage, level: "success" });
    },
  };
};

morgan.token("body", extractRequestBody);
morgan.token("query", extractRequestQuery);
morgan.token("params", extractRequestParams);
morgan.token("validation_errors", extractValidationErrors);

export function fillWithPad(withString: string, length = 12, pad = " ") {
  const total = withString.length;
  const remaining = length > total + 1 ? length - total : 1;
  const rightSpace = pad.repeat(remaining);
  return `${pad}${withString}${rightSpace}`;
}

export const isNotEmpty = (obj: Record<string, unknown>) => Object.keys(obj).length > 0;

export const getSymbol = (unicode: string, fallback = "", pad = "") => {
  return isUnicodeSupported() ? `${pad}${unicode}${pad}` : fallback ? `${pad}${fallback}${pad}` : pad;
};

export const getSegment: SegmentFunc =
  (separator = chalk.bgBlueBright.whiteBright, segment = chalk.bgGray.whiteBright) =>
  (message: string, pad = " ") => {
    return segment(`${pad}${message}${pad}`) + separator(pad);
  };

export const prettyPrintMessage = (
  obj: Record<string, unknown>,
  segment: MessageBuilderFunc,
  fill: MessageBuilderFunc,
  message: string,
) => {
  if (isNotEmpty(obj)) {
    return `${segment(`DETAILS ${getSymbol("⟱", "=>")}`)} \n ${inspect(obj, { sorted: true, breakLength: 1, depth: 7 })}\n${fill(fillWithPad(message))}${segment(fillWithPad(`DETAILS END ${getSymbol("⟰")}`, 24))}`;
  }
  return "";
};

export const getMessageBuilder: ColorBuilderFunc =
  (segment, titleSegment) =>
  ({ timestamp, message, level, ...rest }: MorganMessage) =>
    titleSegment(fillWithPad(level.toUpperCase())) +
    segment(dateFormat(new TZDate(timestamp, "Asia/Colombo"), " MMM Do iii hh:mm::ss SSS aa  OOO ")) +
    segment(`${fillWithPad(`[${message}]`, 16)} `) +
    prettyPrintMessage(rest, segment, titleSegment, level.toUpperCase());

const errorSegmentTitle = getSegment(chalk.bgRed.whiteBright, chalk.bgRed.whiteBright);
const errorSegment = getSegment(chalk.bgRed.whiteBright);

const infoSegmentTitle = getSegment(chalk.bgBlueBright.whiteBright, chalk.bgBlueBright.black);
const infoSegment = getSegment(chalk.bgBlueBright.whiteBright);

const successSegmentTitle = getSegment(chalk.bgGreenBright.whiteBright, chalk.bgGreenBright.black);
const successSegment = getSegment(chalk.bgGreenBright.whiteBright);

const warnSegmentTitle = getSegment(chalk.bgYellowBright.whiteBright, chalk.bgYellowBright.black);
const warnSegment = getSegment(chalk.bgYellowBright.whiteBright);

const debugSegmentTitle = getSegment(chalk.bgWhiteBright.black, chalk.bgWhiteBright.black);
const debugSegment = getSegment(chalk.bgWhiteBright.black);

export const getErrorLog = getMessageBuilder(errorSegment, errorSegmentTitle);
export const getSuccessLog = getMessageBuilder(successSegment, successSegmentTitle);
export const getInfoLog = getMessageBuilder(infoSegment, infoSegmentTitle);
export const getWarnLog = getMessageBuilder(warnSegment, warnSegmentTitle);
export const getDebugLog = getMessageBuilder(debugSegment, debugSegmentTitle);
