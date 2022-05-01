import {
    v4,
    isWebSocketCloseEvent,
    isWebSocketPingEvent,
    WebSocket
} from "../libraries.ts";


const sockets = new Map<string, WebSocket>()

const broadCastPoints = (message: string, uid: string) => {
    sockets.forEach((socket) => {
        if (!socket.isClosed && sockets.get(uid) !== socket)
            socket.send(message)
    })
}

export async function handleWs(sock: WebSocket) {
    const uid = v4.generate()
    sockets.set(uid, sock)
    console.log('new user joined')
    try {
        for await (const ev of sock) {
            if (isWebSocketPingEvent(ev)) {
                const [, body] = ev;
                console.log("ws:Ping", body);
            }
            if (typeof ev === "string") {
                console.log(ev)
                broadCastPoints(ev, uid)
                await sock.send(ev);
            }
            if (isWebSocketCloseEvent(ev)) {
                sockets.delete(uid)
                if (ev?.reason) {
                    const {code, reason} = ev;
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
