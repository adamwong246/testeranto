/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PM } from ".";
export class PM_Web extends PM {
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
        const filepath = x[0];
        const contents = x[1];
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
