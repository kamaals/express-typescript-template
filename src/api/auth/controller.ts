import type { DB, LoginRequest, UserInToken, UserRequest, UserType } from "@/@types";
import { User } from "@/lib/drizzle/schema";
import { createErrorResponse } from "@/lib/services/error";
import { createSuccessResponse } from "@/lib/services/success";
import { compareUserPassword, generateToken } from "@/lib/utils/auth";
import { handleError } from "@/lib/utils/error-handle";
import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PostgresError } from "postgres";

export const login = (db: DB) => async (request: LoginRequest, response: Response) => {
  try {
    const user = await db.query.User.findFirst({
      where: (User, { eq }) => eq(User.email, request.body.email),
      columns: {
        password: true,
        name: true,
        email: true,
        id: true,
        role: true,
      },
    });

    if (user) {
      const isPasswordCorrect = await compareUserPassword(request.body.password, user.password);
      if (isPasswordCorrect) {
        const token = await generateToken({
          name: user.name,
          email: user.email,
          id: user.id,
          role: user.role,
        } as unknown as UserInToken);
        response.cookie("x-access-token", token, {
          httpOnly: true,
          domain: "localhost",
        });
        response.status(StatusCodes.OK).send({ token });
      } else {
        response.status(StatusCodes.FORBIDDEN).send("Invalid credentials");
      }
    }
  } catch (e) {
    console.log(e);
    if (e instanceof PostgresError) {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.detail);
    } else {
      response.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    }
  }
};

export const register = (db: DB) => async (request: UserRequest, response: Response) => {
  try {
    const user = (await db
      .insert(User)
      .values({ ...request.body })
      .returning()) as unknown as UserType;
    if (user) {
      const token = await generateToken({
        name: user.name,
        email: user.email,
        id: user.id,
        role: user.role,
      } as unknown as UserInToken);
      response.cookie("x-access-token", token, {
        httpOnly: true,
        domain: "localhost",
      });
      createSuccessResponse<{ token: string | null }>(response, { token }, StatusCodes.CREATED);
    } else {
      createErrorResponse<string>(response, "User creation failed", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  } catch (e) {
    createErrorResponse<string>(response, handleError(e), StatusCodes.INTERNAL_SERVER_ERROR);
  }
};
