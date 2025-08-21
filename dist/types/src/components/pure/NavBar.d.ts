import React from 'react';
type NavItem = {
    to?: string;
    label: string | React.ReactNode;
    active?: boolean;
    className?: string;
    badge?: {
        variant: string;
        text: string;
    };
    icon?: React.ReactNode;
};
type NavBarProps = {
    title: string;
    backLink?: string;
    navItems?: NavItem[];
    rightContent?: React.ReactNode;
    showProcessManagerLink?: boolean;
    onToggleCollapse?: () => void;
    isCollapsed?: boolean;
};
export declare const NavBar: React.FC<NavBarProps>;
export {};
