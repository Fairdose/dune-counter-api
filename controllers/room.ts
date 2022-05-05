import {WSState} from "../enums/ws_states.ts";

export const rooms = new Map<string|null, any>()

export const events = Object.freeze({
    adminJoined: () => {

    },
    broadcast: () => {

    },
    ping: () => {

    }
})

export const broadcast = (message: string, uid: string, room: any) => {
    const users = rooms.get(room)
    users.forEach((user: any) => {
        if (user.wSocket.readyState === WSState.OPEN && users.get(uid) !== user)
            user.wSocket.send(message)
    })
}
