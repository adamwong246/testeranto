"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturesReporter = void 0;
const react_1 = __importStar(require("react"));
const FeaturesReporterView_1 = require("../pure/FeaturesReporterView");
const features_1 = require("../../types/features");
const FeaturesReporter = () => {
    const [treeData, setTreeData] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('testeranto/projects.json');
                if (!response.ok)
                    throw new Error('Failed to fetch projects');
                const projectNames = await response.json();
                setTreeData((0, features_1.buildTree)(projectNames));
            }
            catch (error) {
                console.error('Error loading projects:', error);
            }
        };
        fetchProjects();
    }, []);
    return react_1.default.createElement(FeaturesReporterView_1.FeaturesReporterView, { treeData: treeData });
};
exports.FeaturesReporter = FeaturesReporter;
