import "https://deno.land/x/dotenv/load.ts";
import { Server } from "./libraries.ts"
import routes from "./router/_routes.ts";

const handler = (req: Request): Response => {
    console.log(routes)
    return new Response()
}

const port = Deno.env.get('SERVER_PORT') ?? 6060

const server = new Server({ addr: `:${port}`, handler })

console.log(`server listening on http://localhost:${port}`)

await server.listenAndServe()
