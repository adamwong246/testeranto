import fs from "fs/promises";
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

const solidifier = async (path, recursivePayload = {}) => {

  const text = (await fs.readFile(path)).toString();

  const importLines = text
    .split('\n')
    .filter((line, index, arr) => {
      return index !== arr.length - 1 &&
        line !== "" &&
        line.trim().startsWith("import") === true
    })
    .map((line) => {
      const relativePathsplit = line.split(' ');
      return buildFullPath(path, relativePathsplit[relativePathsplit.length - 1].trim().slice(1, -2));
    });

  for (const importLine of importLines) {
    recursivePayload = {
      ...recursivePayload,
      ...(await solidifier(importLine))
    }
  }

  recursivePayload[path] = text

  return recursivePayload;
}

export const solCompile = async (entrySolidityFile) => {
  const sources = await solidifier(process.cwd() + `/contracts/${entrySolidityFile}.sol`)

  const remmapedSources = {};
  for (const filepath of Object.keys(sources)) {
    const x = filepath.split(process.cwd() + "/contracts/");
    if (x.length === 1) {
      remmapedSources[(filepath.split(process.cwd() + "/node_modules/"))[1]] = sources[filepath]
    } else {
      remmapedSources[filepath] = sources[filepath]
    }
  }

  return await Compile.sources({ sources: remmapedSources, options: TruffleConfig.detect() })
};

export default {

};
