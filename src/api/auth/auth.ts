import type { DB } from "@/@types";
import { login, register } from "@/api/auth/controller";
import { insertUserSchema, loginSchema, registerUserSchema } from "@/lib/drizzle/schema";
import { deleteConfirmPassword, userPasswordHashing } from "@/lib/middlewares/user-middleware";
import { validateRequestBody } from "@/lib/middlewares/validate";
import type { Router } from "express";

export const auth = (router: Router, db: DB) => {
  router.post("/login", validateRequestBody(loginSchema), login(db));

  router.post(
    "/register",
    validateRequestBody(registerUserSchema),
    userPasswordHashing,
    deleteConfirmPassword,
    validateRequestBody(insertUserSchema),
    register(db),
  );
  return router;
};
