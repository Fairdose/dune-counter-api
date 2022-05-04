export const sockets = new Map<string, WebSocket>()

export const broadCastPoints = (message: string, uid: string) => {
    sockets.forEach((socket) => {
        if (!socket.isClosed && sockets.get(uid) !== socket)
            socket.send(message)
    })
}

export async function handleWs(sock: WebSocket, room: number) {
    const uid = v4.generate()
    sockets.set(uid, sock)
    console.log('new user joined')
}
