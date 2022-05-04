import { walkSync, Router } from "../libraries.ts"
import adminRoute from "./admin.ts";

const routes = new Router()

console.log(adminRoute)

for (const entry of walkSync("./router")) {
    if (entry.name !== '_routes.ts') {
        console.log(entry)
    }
}

export default routes

