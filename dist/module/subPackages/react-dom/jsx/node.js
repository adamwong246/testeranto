import Testeranto from "../../../Node";
import { createElement } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, {
        beforeAll: async (prototype, artificer) => {
            return await new Promise((resolve, rej) => {
                resolve(null);
            });
        },
        beforeEach: async (reactComponent, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                // Ignore these type errors
                resolve(createElement(testInput));
            });
        },
        andWhen: async function (s, whenCB) {
            return s;
        },
        butThen: async function (s) {
            return s;
        },
        afterEach: async function (store, ndx, artificer) {
            return {};
        },
        afterAll: (store, artificer) => {
            return;
        },
    });
};
