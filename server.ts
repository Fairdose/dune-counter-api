import { Server } from "./libraries.ts"
import { handleWs } from "./controllers/webSocket.ts"

const listener = Deno.listen({ port: Number(Deno.args) })

const handler = (req: Request): Response => {
    if (req.headers.get("upgrade") === "websocket") {
        return handleWs(req)
    }
    console.log(req)
    return new Response(`${req}`)
}

const server = new Server({handler})

console.log(`server listening on http://localhost:${Deno.args}`)

await server.serve(listener)
