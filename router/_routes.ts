import { walkSync, Router } from "../libraries.ts"

const routes = new Router()

for (const entry of walkSync("./router")) {
    if (entry.name !== '_routes.ts') {
        console.log(entry)
    }
}

export default routes

