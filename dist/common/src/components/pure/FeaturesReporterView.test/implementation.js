"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.implementation = void 0;
const chai_1 = require("chai");
const mockTreeData = [
    {
        name: "project-1",
        type: "project",
        children: [
            {
                name: "src/file1.test.ts",
                type: "file",
                path: "src/file1.test.ts",
                children: [
                    {
                        name: "test1",
                        type: "test",
                        status: "passed",
                        children: [
                            {
                                name: "given1",
                                type: "given",
                                status: "passed",
                                children: [
                                    {
                                        name: "then1",
                                        type: "then",
                                        status: "passed"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
exports.implementation = {
    suites: {
        Default: "Features Reporter View Tests",
    },
    givens: {
        Default: () => ({
            treeData: mockTreeData
        }),
        WithEmptyData: () => ({
            treeData: []
        }),
    },
    whens: {},
    thens: {
        hasProjectNames: () => async ({ htmlElement }) => {
            const projectNodes = htmlElement.querySelectorAll('.tree-node.project');
            chai_1.assert.isAtLeast(projectNodes.length, 1, 'Should show project names');
            return { htmlElement };
        },
        hasFilePaths: () => async ({ htmlElement }) => {
            const fileNodes = htmlElement.querySelectorAll('.tree-node.file');
            chai_1.assert.isAtLeast(fileNodes.length, 1, 'Should show file paths');
            return { htmlElement };
        },
        hasTestNames: () => async ({ htmlElement }) => {
            const testNodes = htmlElement.querySelectorAll('.tree-node.test');
            chai_1.assert.isAtLeast(testNodes.length, 1, 'Should show test names');
            return { htmlElement };
        },
        hasStatusBadges: () => async ({ htmlElement }) => {
            const statusBadges = htmlElement.querySelectorAll('.status-badge');
            chai_1.assert.isAtLeast(statusBadges.length, 1, 'Should show status badges');
            return { htmlElement };
        },
        showsEmptyMessage: () => async ({ htmlElement }) => {
            const emptyMessage = htmlElement.querySelector('.empty-message');
            chai_1.assert.exists(emptyMessage, 'Should show empty message');
            return { htmlElement };
        },
        takeScreenshot: (name) => async ({ htmlElement }, pm) => {
            const p = await pm.page();
            await pm.customScreenShot({ path: name }, p);
            return { htmlElement };
        },
    },
};
