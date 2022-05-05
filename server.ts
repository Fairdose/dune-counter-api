import "https://deno.land/x/dotenv/load.ts"
import { Server } from "./libraries.ts"
import { handleWs } from "./controllers/webSocket.ts"

const port = Number(Deno.env.get('SERVER_PORT')) ?? 6060

const listener = Deno.listen({ port })

const handler = (req: Request): Response => {
    if (req.headers.get("upgrade") === "websocket") {
        return handleWs(req)
    }
    return new Response(null, {status: 501})
}

const server = new Server({handler})

console.log(`server listening on http://localhost:${port}`)

await server.serve(listener)
