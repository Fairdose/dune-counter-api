import { Router } from "../libraries.ts"

const adminRoutes = new Router()

module.exports = () => {
    adminRoutes.get('/', async (req: Request, rec: Record<any, any>) => {
        if (req.headers.hasOwnProperty('upgrade')) {
            let response, socket: WebSocket;
            try {
                ({ response, socket } = Deno.upgradeWebSocket(req));
            } catch {
                return new Response("request isn't trying to upgrade to websocket.");
            }
            socket.onopen = () => console.log("socket opened");
            socket.onmessage = (e) => {
                console.log("socket message:", e.data);
                socket.send(new Date().toString());
            };
            socket.onerror = (e) => console.log("socket errored:", e);
            socket.onclose = () => console.log("socket closed");
            return response;
        }
    })
}
