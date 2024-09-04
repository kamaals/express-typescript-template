import { init } from "@/lib/init";
import { welcome } from "@/lib/welcome";

console.log("App started");

init().then(() => {
  console.log(welcome());
});
