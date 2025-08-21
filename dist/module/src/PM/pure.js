/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PM } from ".";
const fPaths = [];
export class PM_Pure extends PM {
    getInnerHtml(selector, page) {
        throw new Error("pure.ts getInnerHtml not implemented");
    }
    stopSideCar(uid) {
        throw new Error("pure.ts stopSideCar not implemented");
    }
    constructor(t) {
        super();
        this.server = {};
        this.testResourceConfiguration = t;
    }
    trackCall(method, args) {
        // Track calls if needed
    }
    start() {
        return new Promise((r) => r());
    }
    stop() {
        return new Promise((r) => r());
    }
    async createWriteStream(filepath, testName) {
        throw new Error("pure.ts createWriteStream not implemented");
        return "";
    }
    launchSideCar(n) {
        return globalThis["launchSideCar"](n, this.testResourceConfiguration.name);
    }
    pages() {
        return globalThis["pages"]();
    }
    waitForSelector(p, s) {
        return globalThis["waitForSelector"](p, s);
    }
    closePage(p) {
        return globalThis["closePage"](p);
    }
    goto(cdpPage, url) {
        return globalThis["goto"](cdpPage.mainFrame()._id, url);
    }
    newPage() {
        return globalThis["newPage"]();
    }
    $(selector) {
        return globalThis["$"](selector);
    }
    isDisabled(selector) {
        return globalThis["isDisabled"](selector);
    }
    getAttribute(selector, attribute) {
        return globalThis["getAttribute"](selector, attribute);
    }
    getValue(selector) {
        return globalThis["getValue"](selector);
    }
    focusOn(selector) {
        return globalThis["focusOn"](selector);
    }
    typeInto(selector, value) {
        return globalThis["typeInto"](selector, value);
    }
    page() {
        return globalThis["page"]();
    }
    click(selector) {
        return globalThis["click"](selector);
    }
    screencast(opts, page) {
        return globalThis["screencast"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page, this.testResourceConfiguration.name);
    }
    screencastStop(p) {
        return globalThis["screencastStop"](p);
    }
    customScreenShot(opts, page) {
        return globalThis["customScreenShot"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page, this.testResourceConfiguration.name);
    }
    // TODO: fix these
    existsSync(destFolder) {
        return Promise.resolve(true);
    }
    mkdirSync() {
        return true;
    }
    write(uid, contents) {
        return Promise.resolve(true);
    }
    writeFileSync() {
        return Promise.resolve(true);
    }
    /////////////////////////////////////////////////////
    end(uid) {
        return globalThis["end"](uid);
    }
    customclose() {
        globalThis["customclose"](this.testResourceConfiguration.fs, this.testResourceConfiguration.name);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            this.trackCall("testArtiFactoryfileWriter", { fPath, value });
            callback(Promise.resolve());
        };
    }
}
