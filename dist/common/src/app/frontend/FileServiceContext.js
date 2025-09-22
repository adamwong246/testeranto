"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFileService = exports.FileServiceContext = void 0;
const react_1 = __importDefault(require("react"));
exports.FileServiceContext = react_1.default.createContext(null);
const useFileService = () => {
    const context = react_1.default.useContext(exports.FileServiceContext);
    if (!context) {
        throw new Error("useFileService must be used within a FileServiceProvider");
    }
    return context;
};
exports.useFileService = useFileService;
