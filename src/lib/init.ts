import { API_PATH, SWAGGER_PATH, env } from "@/lib/config";
import { mainLogger } from "@/lib/logger/winston";
import { getServer } from "@/lib/server";
import type { ServerError } from "@/lib/utils/error-handle";

export const init = async () => {
  return new Promise<string>((resolve, reject) => {
    (async () => {
      try {
        const app = getServer();

        const server = app.listen(env.PORT, () => {
          mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}`);
          mainLogger.info(
            `Server running on http://${env.HOST}:${env.PORT}${API_PATH}heart-beat`,
          );
          mainLogger.info(
            `Server running on http://${env.HOST}:${env.PORT}${API_PATH}${SWAGGER_PATH}`,
          );
        });
        resolve("Server started");
        server.on("error", (err: ServerError) => {
          if (err.code) {
            mainLogger.error(`PORT ${err.port} Already in use`, err);
          }
        });
      } catch (e) {
        reject("Something went wrong");
      }
    })();
  });
};
