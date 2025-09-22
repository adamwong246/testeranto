import React from "react";
export const FileServiceContext = React.createContext(null);
export const useFileService = () => {
    const context = React.useContext(FileServiceContext);
    if (!context) {
        throw new Error("useFileService must be used within a FileServiceProvider");
    }
    return context;
};
