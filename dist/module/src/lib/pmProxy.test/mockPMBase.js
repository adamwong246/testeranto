export class MockPMBase {
    constructor(configs) {
        this.calls = {};
        this.testResourceConfiguration = {};
        this.configs = configs || {};
    }
    // Common tracking functionality
    trackCall(method, args) {
        if (!this.calls[method]) {
            this.calls[method] = [];
        }
        this.calls[method].push(args);
    }
    getCallCount(method) {
        var _a;
        return ((_a = this.calls[method]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
    getLastCall(method) {
        const calls = this.calls[method];
        return calls ? calls[calls.length - 1] : null;
    }
    // Minimal implementations of required methods
    launchSideCar(n, testName, projectName) {
        this.trackCall("launchSideCar", { n, testName, projectName });
        return Promise.resolve();
    }
    end(uid) {
        this.trackCall("end", { uid });
        return Promise.resolve(true);
    }
    writeFileSync(path, content, testName) {
        this.trackCall("writeFileSync", { path, content, testName });
        return Promise.resolve(true);
    }
    createWriteStream(path, testName) {
        this.trackCall("createWriteStream", { path, testName });
        return Promise.resolve(0);
    }
    screencast(opts, testName, page) {
        this.trackCall("screencast", { opts, testName, page });
        return Promise.resolve({});
    }
    customScreenShot(opts, testName, pageUid) {
        this.trackCall("customScreenShot", { opts, testName, pageUid });
        return Promise.resolve({});
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            this.trackCall("testArtiFactoryfileWriter", { fPath, value });
            callback(Promise.resolve());
        };
    }
    // Other required PM_Base methods with minimal implementations
    closePage(p) {
        return Promise.resolve();
    }
    $(selector, p) {
        return Promise.resolve();
    }
    click(selector, page) {
        return Promise.resolve();
    }
    goto(p, url) {
        return Promise.resolve();
    }
    newPage() {
        return Promise.resolve("mock-page");
    }
    pages() {
        return Promise.resolve(["mock-page"]);
    }
    waitForSelector(p, s) {
        return Promise.resolve(true);
    }
    focusOn(selector, p) {
        return Promise.resolve();
    }
    typeInto(value, p) {
        return Promise.resolve();
    }
    getAttribute(selector, attribute, p) {
        return Promise.resolve();
    }
    getInnerHtml(selector, p) {
        return Promise.resolve();
    }
    isDisabled(selector, p) {
        return Promise.resolve(false);
    }
    screencastStop(s) {
        return Promise.resolve();
    }
    existsSync(destFolder) {
        return false;
    }
    mkdirSync(fp) {
        return Promise.resolve();
    }
    write(uid, contents) {
        return Promise.resolve(true);
    }
    page(p) {
        return "mock-page";
    }
    doInPage(p, cb) {
        return Promise.resolve();
    }
    customclose() {
        return Promise.resolve();
    }
}
