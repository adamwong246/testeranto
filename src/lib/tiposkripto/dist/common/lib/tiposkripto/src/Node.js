"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTiposkripto = void 0;
const fs_1 = __importDefault(require("fs"));
const BaseTiposkripto_1 = __importDefault(require("./BaseTiposkripto"));
const types_1 = require("./types");
console.log(`[NodeTiposkripto] ${process.argv}`);
const config = { ports: [1111], fs: 'testeranto/reports/allTests/example/Calculator.test/node' };
class NodeTiposkripto extends BaseTiposkripto_1.default {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        // console.log(`[NodeTiposkripto] constructor ${process.argv[3]}`);
        // const config = JSON.parse(process.argv[3])
        super("node", input, testSpecification, testImplementation, testResourceRequirement, testAdapter, config);
    }
    writeFileSync(filename, payload) {
        console.log('writeFileSync', filename);
        const dir = "testeranto/reports/allTests/example";
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        // Write to the exact filename provided
        fs_1.default.writeFileSync(filename, payload);
    }
}
exports.NodeTiposkripto = NodeTiposkripto;
const tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = types_1.defaultTestResourceRequirement) => {
    try {
        const t = new NodeTiposkripto(input, testSpecification, testImplementation, testResourceRequirement, testAdapter);
        return t;
    }
    catch (e) {
        console.error(`[Node] Error creating Tiposkripto:`, e);
        console.error(e.stack);
        process.exit(-1);
    }
};
exports.default = tiposkripto;
