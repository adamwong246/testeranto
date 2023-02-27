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
export const Http2xTesteranto = (testImplementations, testSpecifications, testInput) => Testeranto(testInput, testSpecifications, testImplementations, { ports: 2 }, {
    beforeEach: function (serverFactory, initialValues, testResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const serverA = serverFactory();
            yield serverA.listen(testResource.ports[0]);
            const serverB = serverFactory();
            yield serverB.listen(testResource.ports[1]);
            return { serverA, serverB };
        });
    },
    afterEach: function ({ serverA, serverB }, ndx) {
        return new Promise((res) => {
            serverA.close(() => {
                serverB.close(() => {
                    res(true);
                });
            });
        });
    },
    andWhen: function (store, actioner, testResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const [path, body, portSlot] = actioner(store);
            const y = yield fetch(`http://localhost:${testResource.ports[portSlot]}/${path}`, {
                method: "POST",
                body,
            });
            return yield y.text();
        });
    },
    butThen: function (store, callback, testResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const [path, expectation, portSlot] = callback({});
            const bodytext = yield (yield fetch(`http://localhost:${testResource.ports[portSlot]}/${path}`)).text();
            assert.equal(bodytext, expectation);
            return bodytext;
        });
    },
});
