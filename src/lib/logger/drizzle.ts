import type { Logger } from 'drizzle-orm/logger';
import { mainLogger } from '@/lib/logger/winston';
import { logNames } from '@/lib/logger/helper';


export class WinstonDrizzleLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    mainLogger.debug(logNames.db.debug, { query, params, subtitle: "Drizzle" });
  }
}
