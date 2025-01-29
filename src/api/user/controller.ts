import type {
  DB,
  UserDelete,
  UserQueryRequest,
  UserRequest,
  UserType,
} from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { handleError } from "@/lib/utils/error-handle";

import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const createUser =
  (db: DB) => async (request: UserRequest, response: Response) => {
    try {
      const user = await db
        .insert(User)
        .values({ ...request.body })
        .returning();

      createSuccessResponse<UserType>(
        response,
        user as unknown as UserType,
        StatusCodes.CREATED,
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

export const updateUser =
  (db: DB) => async (request: UserRequest, response: Response) => {
    try {
      const user = await db
        .update(User)
        .set({ ...request.body })
        .where(eq(User.id, request.params.id))
        .returning();

      createSuccessResponse<UserType>(
        response,
        user as unknown as UserType,
        StatusCodes.CREATED,
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

export const deleteUser =
  (db: DB) => async (request: UserDelete, response: Response) => {
    try {
      const user = await db.delete(User).where(eq(User.id, request.params.id));
      createSuccessResponse<UserType>(
        response,
        user as unknown as UserType,
        StatusCodes.OK,
        "User Deleted",
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

export const getUser =
  (db: DB) => async (request: UserQueryRequest, response: Response) => {
    try {
      const users = await db.query.User.findMany({
        columns: { password: false, role: false },
        where: request.query.role
          ? (User, { eq }) => eq(User.id, request.query.role as string)
          : undefined,
      });
      createSuccessResponse<UserType>(
        response,
        [...users] as unknown as UserType,
        StatusCodes.OK,
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };

export const getUserById =
  (db: DB) => async (request: Request, response: Response) => {
    try {
      const user = await db.query.User.findFirst({
        where: (User, { eq }) => eq(User.id, request.params.id),
        with: { bookings: true },
        columns: { password: false },
      });
      createSuccessResponse<UserType>(
        response,
        user as unknown as UserType,
        StatusCodes.OK,
      );
    } catch (e) {
      createErrorResponse<string>(
        response,
        handleError(e),
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  };
