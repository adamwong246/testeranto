"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockPM = void 0;
const mockPMBase_1 = require("./mockPMBase");
class MockPM extends mockPMBase_1.MockPMBase {
    constructor(configs) {
        super(configs);
        this.server = {};
        this.testResourceConfiguration = {};
    }
    // PM-specific methods
    start() {
        this.trackCall("start", {});
        return Promise.resolve();
    }
    stop() {
        this.trackCall("stop", {});
        return Promise.resolve();
    }
    launchSideCar(n) {
        this.trackCall("launchSideCar", { n });
        return Promise.resolve([n, this.testResourceConfiguration]);
    }
    stopSideCar(n) {
        this.trackCall("stopSideCar", { n });
        return Promise.resolve();
    }
    // Override any methods that need different behavior from MockPMBase
    // For example:
    writeFileSync(path, content) {
        return super.writeFileSync(path, content, "default-test-name");
    }
}
exports.MockPM = MockPM;
