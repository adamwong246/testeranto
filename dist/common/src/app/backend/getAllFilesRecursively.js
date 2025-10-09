"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFilesRecursively = getAllFilesRecursively;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function getAllFilesRecursively(directoryPath) {
    let fileList = [];
    const files = await fs_1.default.readdirSync(directoryPath, { withFileTypes: true });
    for (const file of files) {
        const fullPath = path_1.default.join(directoryPath, file.name);
        if (file.isDirectory()) {
            fileList = fileList.concat(await getAllFilesRecursively(fullPath));
        }
        else if (file.isFile()) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}
