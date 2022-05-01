import "https://deno.land/std@0.135.0/dotenv/load.ts";
import {
    serve,
    v4,
    Router,
    acceptWebSocket
} from "./libraries.ts";
import { handleWs } from "./methods/webSocket.ts";

/* This declaration is for TypeScript error */
declare global {
    interface ReadableStream<R> {
        getIterator(): any
    }
}

const port = Deno.env.get("SERVER_PORT") ?? 6060;

const routes = new Router()

routes.get("", async (r: Request, p: Record<string, string>) => {
    console.log(r)
    return new Response("Hello from / handler");
});

if (import.meta.main) {
    console.log(`websocket server is running on :${port}`);

    await serve(async(r) =>
        await routes.route(r))

    /*
    for await (const req of serve(`:${port}`)) {
        if (req.headers.hasOwnProperty('upgrade')) {
            const {conn, r: bufReader, w: bufWriter, headers} = req;
            const wSocket = await acceptWebSocket({ conn, bufReader, bufWriter, headers })
            try {
                handleWs(wSocket)
            } catch (e) {
                console.error(`failed to accept websocket: ${e}`);
                await req.respond({status: 400});
            }
        } else {
            console.log('other req')
            new Response('responded')
        }
    }
     */
}
