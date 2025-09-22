import { assert } from "chai";
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
export const implementation = {
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
            assert.isAtLeast(projectNodes.length, 1, 'Should show project names');
            return { htmlElement };
        },
        hasFilePaths: () => async ({ htmlElement }) => {
            const fileNodes = htmlElement.querySelectorAll('.tree-node.file');
            assert.isAtLeast(fileNodes.length, 1, 'Should show file paths');
            return { htmlElement };
        },
        hasTestNames: () => async ({ htmlElement }) => {
            const testNodes = htmlElement.querySelectorAll('.tree-node.test');
            assert.isAtLeast(testNodes.length, 1, 'Should show test names');
            return { htmlElement };
        },
        hasStatusBadges: () => async ({ htmlElement }) => {
            const statusBadges = htmlElement.querySelectorAll('.status-badge');
            assert.isAtLeast(statusBadges.length, 1, 'Should show status badges');
            return { htmlElement };
        },
        showsEmptyMessage: () => async ({ htmlElement }) => {
            const emptyMessage = htmlElement.querySelector('.empty-message');
            assert.exists(emptyMessage, 'Should show empty message');
            return { htmlElement };
        },
        takeScreenshot: (name) => async ({ htmlElement }, pm) => {
            const p = await pm.page();
            await pm.customScreenShot({ path: name }, p);
            return { htmlElement };
        },
    },
};
