import { createElement } from "react";
import { renderToStaticMarkup, renderToStaticNodeStream } from "react-dom/server";
import Stream from 'stream';
import Testeranto from "../../../Node";
export { renderToStaticMarkup, renderToStaticNodeStream, Stream };
export default (testImplementations, testSpecifications, testInput) => {
    return Testeranto(testInput, testSpecifications, testImplementations, {
        // beforeAll: async (
        //   prototype,
        //   artificer
        // ): Promise<ISubject> => {
        //   return await new Promise((resolve, rej) => {
        //     const elem = document.getElementById("root");
        //     if (elem) {
        //       resolve({ htmlElement: elem });
        //     }
        //   })
        // },
        beforeEach: async (reactComponent, ndx, testRsource, artificer) => {
            return new Promise((resolve, rej) => {
                // Ignore these type errors
                resolve(createElement(testInput));
            });
        },
        andWhen: async function (s, actioner) {
            // return actioner()(s);
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
