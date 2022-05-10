import { Server } from "./libraries.ts"
import { handleWs } from "./controllers/webSocket.ts"

const listener = Deno.listen({ port: Number(Deno.args) })
const BOOK_ROUTE = new URLPattern({ pathname: "/books/:id" })

const handler = (req: Request): Response => {
    const match = BOOK_ROUTE.exec(req.url)

    if (req.headers.get("upgrade") === "websocket") {
        return handleWs(req)
    }

    if (match) {
        const id = match.pathname.groups.id
        return new Response(`Book ${id}`)
    }

    return new Response(`${req}`)
}

const server = new Server({handler})

console.log(`server listening on http://localhost:${Deno.args}`)

await server.serve(listener)
