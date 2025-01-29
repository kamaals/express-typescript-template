import { API_PATH, SWAGGER_PATH, env } from "@/lib/config";
import { connectDB } from "@/lib/drizzle/db";
import { mainLogger } from "@/lib/logger/winston";
import { getServer } from "@/lib/server";
import type { DB } from '@/@types';
import type { ServerError } from '@/lib/utils/error-handle';


export const init = async () => {
  return new Promise<string>((resolve, reject) => {
    (async () => {
      try {
        const db = await connectDB() as unknown as DB;
        //const user = await addDefaultUser(db);
        if (db) {

          const app = getServer(db);

          const server = app.listen(env.PORT, () => {
            mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}`);
            mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}${API_PATH}heart-beat`);
            mainLogger.info(`Server running on http://${env.HOST}:${env.PORT}${API_PATH}${SWAGGER_PATH}`);
          });

          server.on("error", (err: ServerError) => {
            if(err.code) {
              mainLogger.error(`PORT ${err.port} Already in use`, err)
            }

          })

          resolve("DB connected");
        } else {
          reject("DB connection failed");
        }
      } catch (e) {
        reject("Cannot connect the db");
      }
    })();
  });
};
