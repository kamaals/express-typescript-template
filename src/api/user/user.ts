import type { DB } from "@/@types";
import { updatedByValues } from "@/api/user/__test__/default-data";
import {
  createUser,
  deleteUser,
  getUser,
  getUserById,
  updateUser,
} from "@/api/user/controller";
import {
  getUserByQuery,
  insertUserSchema,
  putByIDParam,
  updateUserSchema,
} from "@/lib/drizzle/schema";
import {
  injectDefaultRole,
  userPasswordHashing,
  verifyUserToken,
} from "@/lib/middlewares/user-middleware";
import {
  validateRequestBody,
  validateRequestParams,
  validateRequestQuery,
} from "@/lib/middlewares/validate";
import type { Router } from "express";

export const user = (router: Router, db: DB) => {
  router.post(
    "/user",
    validateRequestBody(insertUserSchema),
    userPasswordHashing,
    injectDefaultRole(db),
    createUser(db),
  );

  router.get("/user", validateRequestQuery(getUserByQuery), getUser(db));

  router.get(
    "/user/:id",
    validateRequestParams(putByIDParam),
    verifyUserToken,
    getUserById(db),
  );

  router.put(
    "/user/:id",
    validateRequestParams(putByIDParam),
    validateRequestBody(updateUserSchema),
    verifyUserToken,
    updatedByValues,
    updateUser(db),
  );

  router.delete(
    "/user/:id",
    validateRequestParams(putByIDParam),
    verifyUserToken,
    deleteUser(db),
  );

  return router;
};

/*
RBAC
API
router =>

user =>

booking => car+user
order => payment+rental

DB => vehicle, user, booking, payment

// rental => car => user

API

user
booking
payment
auth
 */
