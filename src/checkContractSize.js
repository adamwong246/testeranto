const fs = require("fs");
// const Buffer = require("Buffer");

const contractPath = `./build/contracts/FallenAngels.json`;
const obj = JSON.parse(fs.readFileSync(contractPath));
// console.log('contract', obj);
const size = Buffer.byteLength(obj.deployedBytecode, 'utf8') / 2;
console.log('contract size is', size);