import type { UserRequestWithToken } from "@/@types";
import type { NextFunction, Response } from "express";

export const updatedByValues = async (request: UserRequestWithToken, _: Response, next: NextFunction) => {
  request.body.updatedAt = new Date();
  request.body.updatedBy = request.body.decoded?.payload.id;
  next();
};

export const createdByValues = async (request: UserRequestWithToken, _: Response, next: NextFunction) => {
  request.body.createdAt = new Date();
  request.body.createdBy = request.body.decoded?.payload.id;
  next();
};
