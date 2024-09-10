import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { getHeartBeatRegistry } from "@/api/status/heart-beat";

export const generateOpenAPIDocument = () => {
  const registry = new OpenAPIRegistry([getHeartBeatRegistry()]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Express API Boilerplate",
    },
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger/json",
    },
  });
}
