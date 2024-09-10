import { getServer } from '@/lib/server';
import { env } from '@/lib/config';

export const init = async () => {
  const app = getServer();
  app.listen(env.PORT, () => {
    console.log('Server started');
    console.log(`Server running on http://${env.HOST}:${env.PORT}`);
    console.log(`Server running on http://${env.HOST}:${env.PORT}/${env.VERSION}/heart-beat`);
    console.log(`Server running on http://${env.HOST}:${env.PORT}/${env.VERSION}/swagger`);
  });
};
