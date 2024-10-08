import { init } from "@/lib/init";
import { welcome } from "@/lib/welcome";
import { mainLogger } from '@/lib/logger/winston';
init().then(() => {
  mainLogger.info(welcome());
});
