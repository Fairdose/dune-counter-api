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
        if (!socket.isClosed && uid !== id)
            socket.send(message)
    })
}

async function handleWs(sock: WebSocket) {
    console.log("socket connected!");
    const uid = v4.generate()
    sockets.set(uid, sock)
    try {
        for await (const ev of sock) {
            if (typeof ev === "string") {
                // text message.
                console.log(ev)
                broadCastPoints(ev,uid)
                await sock.send(ev);
            } else if (isWebSocketCloseEvent(ev)) {
                // close.
                sockets.delete(uid)
                const { code, reason } = ev;
                console.log("ws:Close", code, reason);
            }
        }
    } catch (err) {
        console.error(`failed to receive frame: ${err}`);

        if (!sock.isClosed) {
            await sock.close(1000).catch(console.error);
        }
    }
}

if (import.meta.main) {
    /** websocket echo server */
    const port = Deno.args[0] || "8080";
    console.log(`websocket server is running on :${port}`);
    for await (const req of serve(`:${port}`)) {
        const { conn, r: bufReader, w: bufWriter, headers } = req;
        acceptWebSocket({
            conn,
            bufReader,
            bufWriter,
            headers,
        })
            .then(handleWs)
            .catch(async function (err) {
                console.error(`failed to accept websocket: ${err}`);
                await req.respond({status: 400});
            });
    }
}
