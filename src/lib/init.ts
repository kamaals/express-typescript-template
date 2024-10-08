import { env } from "@/lib/config";
import { getServer } from "@/lib/server";
import { mainLogger } from '@/lib/logger/winston';

export const init = async () => {
  const app = getServer();
  app.listen(env.PORT, () => {
    mainLogger.debug(`Server running on http://${env.HOST}:${env.PORT}`);
    mainLogger.warn(`Server running on http://${env.HOST}:${env.PORT}/${env.VERSION}/heart-beat`);
    mainLogger.debug(`Server running on http://${env.HOST}:${env.PORT}/${env.VERSION}/swagger`);
  });
};
