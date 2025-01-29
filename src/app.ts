import { init } from "@/lib/init";
import { mainLogger } from "@/lib/logger/winston";
import { welcome } from "@/lib/welcome";

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

init()
  .then(() => {
    mainLogger.info(welcome());
  })
  .catch((e) => mainLogger.error("Cannot Start", {message: e}));
