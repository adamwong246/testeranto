import React from "react";
import "../../App.scss";
export type IModalContentProps = {
    theme: string;
    handleThemeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
export declare const ModalContent: ({ theme, handleThemeChange, }: IModalContentProps) => JSX.Element;
