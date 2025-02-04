import {
  extractRequestBody,
  extractRequestParams,
  extractRequestQuery,
} from "../helper";
import type http from "node:http";

describe("Helper", () => {
  describe("extractRequestBody", () => {
    it("👍Should return string", () => {
      expect(
        extractRequestBody({
          method: "POST",
          body: {},
        } as http.IncomingMessage & { body: Record<string, unknown> }),
      ).toEqual("{}");
    });
    it("👍Should return null", () => {
      expect(
        extractRequestBody({
          method: "GET",
          body: {},
        } as http.IncomingMessage & { body: Record<string, unknown> }),
      ).toBe("null");
    });
  });

  describe("extractRequestQuery", () => {
    it("👍Should return string", () => {
      expect(
        extractRequestQuery({
          method: "GET",
          query: {},
        } as http.IncomingMessage & { query: Record<string, unknown> }),
      ).toEqual("{}");
    });
    it("👍Should return {}", () => {
      expect(
        extractRequestQuery({
          method: "GET",
          query: {},
        } as http.IncomingMessage & { query: Record<string, unknown> }),
      ).toBe("{}");
    });
  });

  describe("extractRequestQuery", () => {
    it("👍Should return string", () => {
      expect(
        extractRequestParams({
          method: "GET",
          params: {},
        } as http.IncomingMessage & { params: Record<string, unknown> }),
      ).toEqual("{}");
    });
    it("👍Should return {}", () => {
      expect(
        extractRequestParams({
          method: "GET",
          params: {},
        } as http.IncomingMessage & { params: Record<string, unknown> }),
      ).toBe("{}");
    });
  });
});
