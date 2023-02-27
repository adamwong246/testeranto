var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from "chai";
import { Testeranto } from "testeranto";
export const HttpTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 1 }, {
    beforeEach: function (serverFactory, initialValues, testResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const server = serverFactory();
            yield server.listen(testResource.ports[0]);
            return server;
        });
    },
    andWhen: function (store, actioner, testResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const [path, body] = actioner(store);
            const y = yield fetch(`http://localhost:${testResource.ports[0]}/${path}`, {
                method: "POST",
                body,
            });
            return yield y.text();
        });
    },
    butThen: function (store, callback, testResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const [path, expectation] = callback({});
            const bodytext = yield (yield fetch(`http://localhost:${testResource.ports[0]}/${path}`)).text();
            assert.equal(bodytext, expectation);
            return bodytext;
        });
    },
    afterEach: function (server, ndx) {
        return new Promise((res) => {
            server.close(() => {
                res(true);
            });
        });
    }
});
