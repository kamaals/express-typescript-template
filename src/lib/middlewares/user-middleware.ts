import type { DB,  UserRequest, UserRequestWithToken } from '@/@types';
import { hashUserPassword, verifyToken } from "@/lib/utils/auth";
import type { NextFunction, Response } from "express";
import { mainLogger } from '@/lib/logger/winston';
import getCurrentLine from 'get-current-line'

export const userPasswordHashing = async (request: UserRequest, _: Response, next: NextFunction) => {
  request.body.password = await hashUserPassword(request.body.password);
  next();
};

export const deleteConfirmPassword = (request: UserRequestWithToken, _: Response, next: NextFunction) => {
  const body = request.body;

  // biome-ignore lint/performance/noDelete: <explanation>
  delete body.confirmPassword;
  request.body = body;
  next();
};

export const injectDefaultRole = (_: DB) => async (request: UserRequest, _: Response, next: NextFunction) => {
  const role = "user";
  if (!request.body.role && role) request.body.role = role;
  next();
};

export const verifyUserToken = async (request: UserRequestWithToken, response: Response, next: NextFunction) => {
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const token = (request.cookies["x-access-token"] || request.headers["authorization"] || "").replace(/bearer./gi, "");
  if (!token) {
    mainLogger.error("No token provided", {message: {reason: "Auth failing due to no token provided", where: getCurrentLine()}, subtitle: "Auth Middleware"});
    return response.status(401).json({ message: "Auth failed: No token provided" });
  }
  const decoded = await verifyToken(token);
  if (decoded) {
    request.body.decoded = decoded;
    next();
  }

  if (!decoded) {
    mainLogger.error("No token provided", {message: {reason: "Auth failing due to Auth failed: Invalid token", where: getCurrentLine()}, subtitle: "Auth Middleware"});
    return response.status(401).json({ message: "Auth failed: Invalid token" });
  }
};
