import type { DB } from "@/@types";
import { API_PATH } from "@/lib/config";
import { getServer } from "@/lib/server";
import { type DeepMockProxy, mockDeep } from "jest-mock-extended";
import supertest from "supertest";

const drizzleMock: DeepMockProxy<DB> = mockDeep();

const app = getServer(drizzleMock);

describe("Heart Beat API", () => {
  describe("get heart-beat", () => {
    describe("given router should work", () => {
      it("Should return 200 status and API is running healthy message", async () => {
        const { body, statusCode } = await supertest(app).get(`${API_PATH}heart-beat`);
        expect(body.data).toBe("API is running healthy");
        expect(statusCode).toBe(200);
        expect(body.message).toBe("Success");
      });
    });
  });
});
