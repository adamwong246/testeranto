import React from 'react';
interface DesignObject {
    type: string;
    [key: string]: any;
}
interface Design {
    version: string;
    background: string;
    objects: DesignObject[];
}
export interface DesignEditorRef {
    loadDesign: (design: Design) => void;
    saveDesign: () => Design | null;
}
export declare const DesignEditor: React.ForwardRefExoticComponent<{
    projectId: string;
} & React.RefAttributes<DesignEditorRef>>;
export {};
