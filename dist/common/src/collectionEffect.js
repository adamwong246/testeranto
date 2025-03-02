"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionEffect = void 0;
const react_1 = require("react");
const collectionEffect = (collection, setter, coercer = (x) => x) => {
    (0, react_1.useEffect)(() => {
        (async () => {
            fetch(`http://localhost:8080/${collection}.json`)
                .then((response) => response.json())
                .then((json) => {
                Promise.all(json.ids.map(async (_id) => {
                    return Object.assign({ _id }, coercer(await (await fetch(`http://localhost:8080/${collection}/${_id}.json`)).json()));
                })).then((items) => {
                    console.log("setting", collection, items);
                    setter(items);
                });
            })
                .catch((error) => console.error(error));
        })();
    }, []);
};
exports.collectionEffect = collectionEffect;
