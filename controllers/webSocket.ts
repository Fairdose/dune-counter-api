import { v4 } from "../libraries.ts";
import { wsEvents, rooms } from "./room.ts";

export const handleWs = (req: Request) => {
    const params = new URLSearchParams(req.url)
    const room = params.get('room')

    const { socket: ws, response } = Deno.upgradeWebSocket(req, { idleTimeout: 300 })
    const uid = v4.generate()

    ws.onopen = () => {
        const user = {
            type: params.get('user'),
            wSocket: ws
        }
        if (rooms.get(room)) {
            rooms.get(room).set(uid, user)
        } else {
            rooms.set(room, new Map<string, any>())
            rooms.get(room).set(uid, user)
        }
        console.log('socket opened')
    }

    ws.onmessage = (req) => {
        const { eventType, message } = req.data
        wsEvents.broadcast(req.data, uid, room)
    }

    ws.onclose = () => {
        rooms.get(room).delete(uid)
        rooms.get(room).size === 0 && rooms.delete(room)
    }

    return response
}
