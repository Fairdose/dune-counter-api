import "https://deno.land/x/dotenv/load.ts"
import {serve, v4} from "./libraries.ts"

const sockets = new Map<string, WebSocket>()
const rooms = new Map<string, typeof sockets>()

console.log(rooms)

const broadcast = (message: string, uid: string) => {
    sockets.forEach((socket) => {
        if (socket.readyState === 1 && sockets.get(uid) !== socket)
            socket.send(message)
    })
}

const handler = (req: Request): Response => {
    if (req.headers.get("upgrade") === "websocket") {
        const u = new URL(req.url)
        console.log(new URL(req.url).searchParams)
        const { socket: ws, response } = Deno.upgradeWebSocket(req)
        const uid = v4.generate()
        sockets.set(uid, ws)
        console.log('new user')

        ws.onmessage = (req) => {
            broadcast(req.data, uid)
        }
        ws.onclose = (req) => {
            sockets.delete(uid)
        }

        return response
    }

    return new Response(null, {status: 501})
}

const port = Number(Deno.env.get('SERVER_PORT')) ?? 6060

console.log(`server listening on http://localhost:${port}`)

await serve(handler, {port})
