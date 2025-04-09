"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PM_Web = void 0;
class PM_Web {
    constructor(t) {
        this.testResourceConfiguration = t;
    }
    start() {
        return new Promise((r) => r());
    }
    stop() {
        return new Promise((r) => r());
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
        return window["getValue"](selector, attribute);
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
    page() {
        return window["page"]();
    }
    click(selector) {
        return window["click"](selector);
    }
    customScreenShot(opts, page) {
        return window["customScreenShot"](Object.assign(Object.assign({}, opts), { path: this.testResourceConfiguration.fs + "/" + opts.path }), this.testResourceConfiguration.name);
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
    writeFileSync(filepath, contents) {
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
