export class Server_Base {
    constructor(configs, mode) {
        this.configs = configs;
        this.mode = mode;
        console.log(`[Base] ${this.configs}`);
    }
    async start() {
        // console.log(`[Server_Base] start()`)
    }
    async stop() {
        console.log(`[Server_Base] stop()`);
        process.exit();
    }
}
