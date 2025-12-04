import { upAll, down, upOne, ps, logs, } from "docker-compose";
export class DockerCompose {
    constructor(cwd, config) {
        this.cwd = cwd;
        this.config = config;
    }
    async upAll(options) {
        const opts = this.mergeOptions(options);
        return await upAll(opts);
    }
    async down(options) {
        const opts = this.mergeOptions(options);
        return await down(opts);
    }
    async upOne(serviceName, options) {
        const opts = this.mergeOptions(options);
        return await upOne(serviceName, opts);
    }
    async ps(options) {
        const opts = this.mergeOptions(options);
        return await ps(opts);
    }
    async logs(serviceName, options) {
        const opts = this.mergeOptions(options);
        return await logs(serviceName, opts);
    }
    mergeOptions(options) {
        const base = {
            cwd: this.cwd,
            config: this.config,
            log: true,
        };
        // Merge options
        const merged = Object.assign(Object.assign({}, base), options);
        // Keep detach in options - the docker-compose library needs it
        return merged;
    }
    getCwd() {
        return this.cwd;
    }
    getConfig() {
        return this.config;
    }
}
