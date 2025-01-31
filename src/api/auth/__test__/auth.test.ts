import type { DB } from "@/@types";
import { API_PATH } from "@/lib/config";
import { getServer } from "@/lib/server";
import { clearAllUsers } from "@/mock/users";
import type { Application } from "express";
import supertest from "supertest";
import { connectDB } from "../../../lib/drizzle/db";

jest.setTimeout(150000);

let app: Application | null = null;

// @ts-ignore
beforeAll(async () => {
  const db = (await connectDB()) as unknown as DB;
  await clearAllUsers(db);
  app = getServer(db);
}, 5000);

afterAll(async () => {
  //await container?.stop();
  //await client?.end();
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
        expect(body.data[0].message).toBe(
          "Unrecognized key(s) in object: 'roleId'",
        );
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
        expect(body.data[0].message).toBe(
          "password does not meet complexity requirements",
        );
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

  /*
   * TODO: Add test for login
   */
  describe("POST login", () => {
    describe("API SHOULD FAIL", () => {});

    describe("API SHOULD PASS", () => {});
  });
});
