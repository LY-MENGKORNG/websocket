type Clients = { client: string }

const clients = new Set<Bun.ServerWebSocket<Clients>>();
const port = 3000

Bun.serve<Clients>({
    port,
    fetch(req, server) {
        const client = new URL(req.url).searchParams.get("client");

        if (!client) {
            return new Response("Unauthorized", { status: 401 });
        }

        if (server.upgrade(req, { data: { client } })) return;
        return new Response("Upgrade failed");
    },

    websocket: {
        open(ws) {
            clients.add(ws);
        },

        message(ws, msg) {
            for (const client of clients) {
                client.send(JSON.stringify({
                    client: ws.data.client,
                    message: msg
                }));
            }
        },

        close(ws) {
            clients.delete(ws);
        },
    },
});
console.log(`Application listening on http://localhost:${port}`)