import {v4} from "../libraries.ts";
import {broadcast,sockets,rooms} from "./room.ts";

export const handleWs = (req: Request) => {
    const params = new URLSearchParams(req.url)
    const room = params.get('room')

    const { socket: ws, response } = Deno.upgradeWebSocket(req)
    const uid = v4.generate()

    ws.onopen = () => {
        const user = {
            type: params.get('uType'),
            wSocket: ws
        }
        const sock = sockets.set(uid, user)
        rooms.set(room, sock)
        console.log(rooms)
        console.log('socket opened')
    }

    ws.onmessage = (req) => {
        broadcast(req.data, uid, room)
    }

    ws.onclose = () => {
        sockets.delete(uid)
        console.log(`socket with id "${uid} closed`)
    }

    return response
}
