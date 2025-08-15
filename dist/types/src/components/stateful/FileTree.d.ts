import { FileType } from './TextEditorPage';
type FileTreeProps = {
    files: FileType[];
    onSelect: (path: string) => void;
    activeFile: string | null;
};
export declare const FileTree: ({ files, onSelect, activeFile }: FileTreeProps) => JSX.Element;
export {};
