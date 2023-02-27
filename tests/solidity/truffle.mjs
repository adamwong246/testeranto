var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from "fs/promises";
import path from "path";
import { Compile } from "@truffle/compile-solidity";
import TruffleConfig from "@truffle/config";
// parent: node_modules/.../ERC721/ERC721.sol
// returns absolute path of a relative one using the parent path
const buildFullPath = (parent, path) => {
    let curDir = parent.substr(0, parent.lastIndexOf("/")); //i.e. ./node/.../ERC721
    if (path.startsWith("@")) {
        return process.cwd() + "/node_modules/" + path;
    }
    if (path.startsWith("./")) {
        return curDir + "/" + path.substr(2);
    }
    while (path.startsWith("../")) {
        curDir = curDir.substr(0, curDir.lastIndexOf("/"));
        path = path.substr(3);
    }
    return curDir + "/" + path;
};
const solidifier = (path, recursivePayload = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const text = (yield fs.readFile(path)).toString();
    const importLines = text
        .split('\n')
        .filter((line, index, arr) => {
        return index !== arr.length - 1 &&
            line !== "" &&
            line.trim().startsWith("import") === true;
    })
        .map((line) => {
        const relativePathsplit = line.split(' ');
        return buildFullPath(path, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
    });
    for (const importLine of importLines) {
        recursivePayload = Object.assign(Object.assign({}, recursivePayload), (yield solidifier(importLine)));
    }
    recursivePayload[path] = text;
    return recursivePayload;
});
export const solCompile = (entrySolidityFile) => __awaiter(void 0, void 0, void 0, function* () {
    const sources = yield solidifier(process.cwd() + `/contracts/${entrySolidityFile}.sol`);
    const remmapedSources = {};
    for (const filepath of Object.keys(sources)) {
        const x = filepath.split(process.cwd() + "/contracts/");
        if (x.length === 1) {
            remmapedSources[(filepath.split(process.cwd() + "/node_modules/"))[1]] = sources[filepath];
        }
        else {
            remmapedSources[filepath] = sources[filepath];
        }
    }
    /* @ts-ignore:next-line */
    const tConfig = new TruffleConfig();
    /* @ts-ignore:next-line */
    const options = TruffleConfig.load(path.resolve(process.cwd(), `truffle-config.cjs`));
    return yield Compile.sources({
        sources: remmapedSources,
        options
    });
});
export default {};
