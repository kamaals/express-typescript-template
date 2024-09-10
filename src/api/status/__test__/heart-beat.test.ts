import supertest from 'supertest';
import { getServer } from '@/lib/server';
import {env} from '@/lib/config';

const app = getServer();

describe('Heart Beat API', () => {
  describe('get heart-beat', () => {
    describe('given router should work', () => {
      it('Should return 200 status and API is running healthy message', async () => {
        const { body, statusCode } = await supertest(app).get(
          `/${env.VERSION}/heart-beat`
        );
        expect(statusCode).toBe(200);
        expect(body.data).toBe('API is running healthy');
        expect(body.message).toBe('Success');
      });

    })
  })
})
