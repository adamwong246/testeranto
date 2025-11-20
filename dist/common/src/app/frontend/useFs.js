"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFs = exports.FileServiceContext = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = require("react");
const DevelopmentFileService_1 = require("./DevelopmentFileService");
exports.FileServiceContext = (0, react_1.createContext)(new DevelopmentFileService_1.DevelopmentFileService());
const useFs = () => {
    const context = (0, react_1.useContext)(exports.FileServiceContext);
    if (!context) {
        throw new Error("useFileService must be used within a FileServiceProvider");
    }
    // Return as an array to make it iterable
    return [context];
};
exports.useFs = useFs;
