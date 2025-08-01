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
};
type NavBarProps = {
    title: string;
    backLink?: string;
    navItems?: NavItem[];
    rightContent?: React.ReactNode;
};
export declare const NavBar: React.FC<NavBarProps>;
export {};
