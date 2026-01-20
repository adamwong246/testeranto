import fs from "fs";
import BaseTiposkripto from "./BaseTiposkripto";
import { defaultTestResourceRequirement } from "./types";
console.log(`[NodeTiposkripto] ${process.argv}`);
const config = { ports: [1111], fs: 'testeranto/reports/allTests/example/Calculator.test/node' };
export class NodeTiposkripto extends BaseTiposkripto {
    constructor(input, testSpecification, testImplementation, testResourceRequirement, testAdapter) {
        // console.log(`[NodeTiposkripto] constructor ${process.argv[3]}`);
        // const config = JSON.parse(process.argv[3])
        super("node", input, testSpecification, testImplementation, testResourceRequirement, testAdapter, config);
    }
    writeFileSync(filename, payload) {
        console.log('writeFileSync', filename);
        const dir = "testeranto/reports/allTests/example";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Write to the exact filename provided
        fs.writeFileSync(filename, payload);
    }
}
const tiposkripto = async (input, testSpecification, testImplementation, testAdapter, testResourceRequirement = defaultTestResourceRequirement) => {
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
export default tiposkripto;
