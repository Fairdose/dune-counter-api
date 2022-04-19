import { serve } from "https://deno.land/std@0.106.0/http/server.ts";
import { v4 } from "https://deno.land/std@0.78.0/uuid/mod.ts";
import {
    acceptWebSocket,
    isWebSocketCloseEvent,
    WebSocket,
} from "https://deno.land/std@0.106.0/ws/mod.ts";

const sockets = new Map<string, WebSocket>()

const broadCastPoints = (message: string, uid: string) => {
    sockets.forEach((socket) => {
        if (!socket.isClosed && sockets.get(uid) !== socket)
            socket.send(message)
    })
}

async function handleWs(sock: WebSocket) {
    const uid = v4.generate()
    sockets.set(uid, sock)
    console.log('new user joined')
    try {
        for await (const ev of sock) {
            if (typeof ev === "string") {
                broadCastPoints(ev,uid)
                await sock.send(ev);
            }
            if (isWebSocketCloseEvent(ev)) {
                sockets.delete(uid)
                if (ev?.reason) {
                    const { code, reason } = ev;
                    console.log("ws:Close", code, reason);
                }
            }
        }
    } catch (err) {
        console.error(err);
        if (!sock.isClosed) {
            await sock.close(1000).catch(console.error);
        }
    }
}

if (import.meta.main) {
    const port = Deno.args[0] || "6060";
    console.log(`websocket server is running on :${port}`);
    for await (const req of serve(`:${port}`)) {
        const {conn, r: bufReader, w: bufWriter, headers} = req;
        const wSocket = await acceptWebSocket({ conn, bufReader, bufWriter, headers })

        try {
            handleWs(wSocket)
        } catch (e) {
            console.error(`failed to accept websocket: ${e}`);
            await req.respond({status: 400});
        }
    }
}
