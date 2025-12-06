import React from 'react';
interface DrawerProps {
    position: 'left' | 'right' | 'bottom';
    isOpen: boolean;
    zIndex: number;
    onToggle: () => void;
    onBringToFront: () => void;
    title: string;
    children: React.ReactNode;
}
export declare const Drawer: React.FC<DrawerProps>;
export {};
