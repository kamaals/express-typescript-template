import { before } from "node:test";
import type { DB, UserType } from "@/@types";
import { API_PATH } from "@/lib/config";
import { getServer } from "@/lib/server";
import { clearAllUsers, insertAllUsers } from "@/mock/users";
import type { Application } from "express";
import supertest from "supertest";
import { connectDB } from "../../../lib/drizzle/db";
import { resetUser } from "../../../lib/drizzle/seed/user";

let app: Application | null = null;
let db: null | DB = null;
let userList: Array<UserType> = [];
let token = "";

jest.setTimeout(150000);

beforeAll(async () => {
  db = (await connectDB()) as unknown as DB;
  userList = await insertAllUsers(db);
  const user = userList[0];

  app = getServer(db);

  const { body } = await supertest(app as Application)
    .post(`${API_PATH}login`)
    .send({
      email: user.email,
      password: "P@ssword1",
    });
  token = body.data.token;
}, 10000);

afterAll(async () => {
  await resetUser(db as DB);
  await clearAllUsers(db as DB);
});

describe("User API", () => {
  it("App should work", () => {
    expect(app).not.toBeNull();
    expect(db).not.toBeNull();
  });

  describe("GET user", () => {
    describe("👍 Given router should work", () => {
      it("👍 Should return 200 status and should return user list", async () => {
        const { statusCode, body } = await supertest(app as Application)
          .get(`${API_PATH}user`)
          .set("Authorization", `Bearer ${token}`);
        expect(body.success).toBe(true);
        expect(statusCode).toBe(200);
      });

      it("👍 Should return 200 status and should return a user", async () => {
        const { statusCode } = await supertest(app as Application)
          .get(`${API_PATH}user/${userList[0].id}`)
          .set("Authorization", `Bearer ${token}`);

        expect(statusCode).toBe(200);
      });
    });

    describe("👎 given router should not work", () => {
      it("👍 Should return 500 status and should return user list", async () => {
        const { statusCode, body } = await supertest(app as Application)
          .get(`${API_PATH}user`)
          .set("Authorization", `Bearer ${token}k`);
        expect(body.message).toBe("Auth failed: Invalid token");
        expect(statusCode).toBe(401);
      });
    });
  });

  describe("POST user", () => {
    const user = {
      email: "user5@example.com",
      password: "Element@#1",
      name: "John Doe5",
    };
    const nextUser = {
      email: "user6@example.com",
      password: "Element@#1",
      name: "John Doe6",
    };
    const userInvalid = {
      email: "user6@:example.com",
      password: "Element@#1",
      name: "John Doe6",
    };
    const userPasswordInvalid = {
      email: "user7@example.com",
      password: "element@#1",
      name: "John Doe7",
    };
    const userInvalid2 = {
      email: "user6@:example.com",
      password: "Element@#1",
    };

    describe("given router should work", () => {
      it("👍 Should return added user and should return status 201", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}user/`)
          .send(user)
          .set("Authorization", `Bearer ${token}`);

        expect(body.data.name).toBe(user.name);
        expect(statusCode).toBe(201);
      });

      it("👍 Should return added user and should return status 201", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}user`)
          .send(nextUser)
          .set("Authorization", `Bearer ${token}`);

        expect(body.data.email).toBe(nextUser.email);
        expect(statusCode).toBe(201);
      });
    });

    describe("👎 given router should not work", () => {
      it("👎 Should return 400 for invalid email", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}user`)
          .send(userInvalid)
          .set("Authorization", `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body.data[0].code).toBe("invalid_string");
      });

      it("👎 Should return 400 for missing field", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}user`)
          .send(userInvalid2)
          .set("Authorization", `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body.data[0].code).toBe("invalid_type");
      });

      it("👎 Should return 400 for password complexity ", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .post(`${API_PATH}user`)
          .send(userPasswordInvalid)
          .set("Authorization", `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body.data[0].message).toBe(
          "password does not meet complexity requirements",
        );
      });

      it("👎 Should return 500 for db error", async () => {
        before(async () => {
          await supertest(app as Application)
            .post(`${API_PATH}user`)
            .send(user)
            .set("Authorization", `Bearer ${token}`);
        });
        const { statusCode } = await supertest(app as Application)
          .post(`${API_PATH}user`)
          .send(user)
          .set("Authorization", `Bearer ${token}`);
        expect(statusCode).toBe(500);
      });
    });
  });

  describe("PUT user", () => {
    describe("given router should work", () => {
      let user: UserType | null = null;

      beforeAll(async () => {
        user = userList[0];
      }, 10);

      it("👍 Should return 201 status and should update the a user", async () => {
        const { body, statusCode } = await supertest(app as Application)
          // @ts-ignore
          .put(`${API_PATH}user/${user?.id}`)
          .send({ name: "Jane Doe" })
          .set("Authorization", `Bearer ${token}`);
        // @ts-ignore
        expect(body.data.id).toEqual(user?.id);
        expect(body.data.name).toEqual("Jane Doe");
        expect(statusCode).toBe(206);
      });

      it("👎 Should return 400 status and should not update the a user", async () => {
        const { body, statusCode } = await supertest(app as Application)
          // @ts-ignore
          .put(`${API_PATH}user/${user?.id}`)
          .send({ name: "Manish Doe", email: "invalid" })
          .set("Authorization", `Bearer ${token}`);

        expect(body.data[0].code).toBe("invalid_string");
        expect(statusCode).toBe(400);
      });
    });
  });

  describe("DELETE user", () => {
    describe("given router should work", () => {
      it("👍 Should delete user and return 200", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .delete(`${API_PATH}user/${userList[0].id}`)
          .set("Authorization", `Bearer ${token}`);
        expect(body.message).toBe("User Deleted");
        expect(statusCode).toBe(200);
      });

      it("🤷 Should not success for invalid ID and return 404", async () => {
        const { body, statusCode } = await supertest(app as Application)
          .delete(`${API_PATH}user/5487`)
          .set("Authorization", `Bearer ${token}`);
        expect(body.message).toBe("Request params Validation Error");
        expect(statusCode).toBe(404);
      });
    });
  });
});
