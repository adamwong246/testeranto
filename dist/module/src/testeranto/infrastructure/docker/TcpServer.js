import net from "net";
import { EventEmitter } from "events";
export class TcpServer extends EventEmitter {
    constructor() {
        super();
        this.port = 0;
        this.connections = new Map();
        this.server = this.createServer();
    }
    createServer() {
        const server = net.createServer((socket) => {
            const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
            console.log(`🔌 TCP connection from ${clientId}`);
            this.connections.set(clientId, { socket, testInfo: {} });
            let buffer = "";
            socket.on("data", (data) => {
                buffer += data.toString();
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";
                for (const line of lines) {
                    if (line.trim()) {
                        try {
                            const message = JSON.parse(line);
                            this.handleMessage(clientId, message, socket);
                        }
                        catch (e) {
                            console.error(`❌ Failed to parse message: ${line}`, e);
                        }
                    }
                }
            });
            socket.on("end", () => {
                console.log(`🔌 TCP connection closed: ${clientId}`);
                this.connections.delete(clientId);
            });
            socket.on("error", (err) => {
                console.error(`❌ TCP socket error for ${clientId}:`, err.message);
                this.connections.delete(clientId);
            });
        });
        return server;
    }
    async start() {
        return new Promise((resolve, reject) => {
            this.server.listen(0, "0.0.0.0", () => {
                const address = this.server.address();
                if (address && typeof address === "object") {
                    this.port = address.port;
                    console.log(`🔌 TCP server listening on port ${this.port}`);
                    resolve(this.port);
                }
                else {
                    console.error(`❌ TCP server failed to get address`);
                    reject(new Error("TCP server failed to get address"));
                }
            });
            this.server.on('error', (err) => {
                console.error(`❌ TCP server error: ${err.message}`);
                reject(err);
            });
        });
    }
    getPort() {
        return this.port;
    }
    getConnections() {
        return this.connections;
    }
    sendToClient(clientId, data) {
        const connection = this.connections.get(clientId);
        if (connection) {
            connection.socket.write(JSON.stringify(data) + "\n");
        }
    }
    broadcast(data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [clientId, connection] of this.connections) {
            this.sendToClient(clientId, data);
        }
    }
    close() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [clientId, connection] of this.connections) {
            connection.socket.end();
        }
        this.connections.clear();
        this.server.close();
    }
    handleMessage(clientId, message, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket) {
        var _a;
        if (!Array.isArray(message) || message.length < 1) {
            console.error(`Invalid message format:`, message);
            return;
        }
        const command = message[0];
        if (command === "register" && message.length >= 2) {
            const serviceName = message[1];
            console.log(`📝 Service ${serviceName} registered via TCP connection ${clientId}`);
            const connection = this.connections.get(clientId);
            if (connection) {
                connection.testInfo = { serviceName };
            }
            this.emit("serviceRegistered", { clientId, serviceName });
            return;
        }
        if (message.length < 2) {
            console.error(`Invalid message format (missing callbackId):`, message);
            return;
        }
        const callbackId = message[message.length - 1];
        const args = message.slice(1, -1);
        let serviceName = "unknown";
        const connection = this.connections.get(clientId);
        if ((_a = connection === null || connection === void 0 ? void 0 : connection.testInfo) === null || _a === void 0 ? void 0 : _a.serviceName) {
            serviceName = connection.testInfo.serviceName;
        }
        console.log(`📤 [${serviceName}] ${command} ${JSON.stringify(args)}`);
        this.emit("commandReceived", {
            clientId,
            serviceName,
            command,
            args,
            callbackId,
        });
    }
}
