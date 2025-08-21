"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Web = void 0;
const _1 = require(".");
class PM_Web extends _1.PM {
    constructor(t) {
        super();
        this.testResourceConfiguration = t;
    }
    start() {
        return new Promise((r) => r());
    }
    stop() {
        return new Promise((r) => r());
    }
    getInnerHtml(selector, page) {
        throw new Error("web.ts getInnHtml not implemented");
    }
    pages() {
        throw new Error("Method not implemented.");
    }
    stopSideCar(n) {
        return window["stopSideCar"](n, this.testResourceConfiguration.name);
    }
    launchSideCar(n) {
        return window["launchSideCar"](n, this.testResourceConfiguration.name);
    }
    waitForSelector(p, s) {
        return window["waitForSelector"](p, s);
    }
    screencast(opts, page) {
        return window["screencast"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), page.mainFrame()._id, this.testResourceConfiguration.name);
    }
    screencastStop(recorder) {
        return window["screencastStop"](recorder);
    }
    closePage(p) {
        return window["closePage"](p);
    }
    goto(p, url) {
        return window["goto"](p, url);
    }
    newPage() {
        return window["newPage"]();
    }
    $(selector) {
        return window["$"](selector);
    }
    isDisabled(selector) {
        return window["isDisabled"](selector);
    }
    getAttribute(selector, attribute) {
        return window["getAttribute"](selector, attribute);
    }
    getValue(selector) {
        return window["getValue"](selector);
    }
    focusOn(selector) {
        return window["focusOn"](selector);
    }
    typeInto(value) {
        return window["typeInto"](value);
    }
    async page(x) {
        return window["page"](x);
    }
    click(selector) {
        return window["click"](selector);
    }
    customScreenShot(x, y) {
        const opts = x[0];
        const page = x[1];
        // console.log("customScreenShot 2 opts", opts);
        // console.log("customScreenShot 2 page", page);
        return window["customScreenShot"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), this.testResourceConfiguration.name, page);
    }
    existsSync(destFolder) {
        return window["existsSync"](destFolder);
    }
    mkdirSync(x) {
        return window["mkdirSync"](this.testResourceConfiguration.fs + "/");
    }
    write(uid, contents) {
        return window["write"](uid, contents);
    }
    writeFileSync(x) {
        // eslint-disable-next-line prefer-rest-params
        // const z = arguments["0"];
        // const filepath = z[0];
        // const contents = z[1];
        const filepath = arguments[0];
        const contents = arguments[1];
        return window["writeFileSync"](this.testResourceConfiguration.fs + "/" + filepath, contents, this.testResourceConfiguration.name);
    }
    createWriteStream(filepath) {
        return window["createWriteStream"](this.testResourceConfiguration.fs + "/" + filepath, this.testResourceConfiguration.name);
    }
    end(uid) {
        return window["end"](uid);
    }
    customclose() {
        window["customclose"](this.testResourceConfiguration.fs, this.testResourceConfiguration.name);
    }
    testArtiFactoryfileWriter(tLog, callback) {
        return (fPath, value) => {
            callback(new Promise((res, rej) => {
                tLog("testArtiFactory =>", fPath);
            }));
        };
    }
}
exports.PM_Web = PM_Web;
