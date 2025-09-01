import React from 'react';
type AppFrameProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    'data-testid'?: string;
    title?: string;
    rightContent?: React.ReactNode;
};
export declare const AppFrame: ({ children, title, rightContent }: AppFrameProps) => JSX.Element;
export {};
