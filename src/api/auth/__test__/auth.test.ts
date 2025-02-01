import type { DB, UserType } from "@/@types";
import { API_PATH } from "@/lib/config";
import { getServer } from "@/lib/server";
import { clearAllUsers, insertAllUsers } from "@/mock/users";
import type { Application } from "express";
import supertest from "supertest";
import { connectDB } from "../../../lib/drizzle/db";
import { resetUser } from "../../../lib/drizzle/seed/user";

jest.setTimeout(15000);

let app: Application | null = null;
let db: null | DB = null;
let userList: Array<UserType> = [];

// @ts-ignore
beforeAll(async () => {
  db = await connectDB();
  db = (await connectDB()) as unknown as DB;
  userList = await insertAllUsers(db);
  app = getServer(db);
}, 5000);

afterAll(async () => {
  await resetUser(db as DB);
  await clearAllUsers(db as DB);
});

describe("AUTH API", () => {
  it("App should work", () => {
    expect(app).not.toBeNull();
  });

  describe("POST register", () => {
    describe("API SHOULD FAIL", () => {
      it("👎 Should return 400 for try to set role ", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}register`)
          .send({
            email: "lorem@arabia.com",
            name: "Lawrence of Arabia",
            password: "P@ssword1",
            confirmPassword: "P@ssword1",
            roleId: "d7dcf266-b23d-47ec-8195-a905bf3120d6",
          });
        expect(statusCode).toBe(400);
        expect(body.data[0].code).toBe("unrecognized_keys");
        expect(body.data[0].message).toBe("Unrecognized key(s) in object: 'roleId'");
      });

      it("👎 Should return 400 for password complexity ", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}register`)
          .send({
            email: "lorem@arabia.com",
            name: "Lawrence of Arabia",
            password: "p@ssword1",
            confirmPassword: "p@ssword1",
          });
        expect(statusCode).toBe(400);
        expect(body.data[0].code).toBe("custom");
        expect(body.data[0].message).toBe("password does not meet complexity requirements");
      });

      it("👎 Should return 400 for password mismatch ", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}register`)
          .send({
            email: "lorem@arabia.com",
            name: "Lawrence of Arabia",
            password: "P@ssword1",
            confirmPassword: "E@ssword1",
          });
        expect(statusCode).toBe(400);
        expect(body.data[0].code).toBe("custom");
        expect(body.data[0].message).toBe("password does not match");
      });
    });

    describe("API SHOULD PASS", () => {
      it("👍 Should return 200 status and should register user", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}register/`)
          .send({
            email: "lorem@arabia.com",
            name: "Lawrence of Arabia",
            password: "P@ssword1",
            confirmPassword: "P@ssword1",
          });
        expect(body.data.token).not.toBeNull();
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("POST login", () => {
    describe("API SHOULD PASS", () => {
      it("👍 Should login user", async () => {
        const user = userList[0];
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}login/`)
          .send({
            email: user.email,
            password: "P@ssword1",
          });
        expect(body.token).not.toBeNull();
        expect(statusCode).toBe(200);
      });

      it("👎 Should return 403 status and should not login.", async () => {
        const user = userList[0];
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}login/`)
          .send({
            email: user.email,
            password: `${user.password} wrong`,
          });
        expect(body.data).toBe("Password Mismatch");
        expect(statusCode).toBe(403);
      });
    });
  });
});
