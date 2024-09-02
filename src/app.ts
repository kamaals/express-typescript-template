import {init} from "@/lib/init";
import {welcome} from "@/lib/welcome";

init().then(() => {
    console.log(welcome())
})
