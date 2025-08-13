export type TreeNode = {
    name: string;
    type: 'project' | 'file';
    path?: string;
    children?: TreeNode[];
};
export declare function buildTree(projects: string[]): TreeNode[];
