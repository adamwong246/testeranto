/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";

import { DevelopmentFileService } from "./DevelopmentFileService";

export const FileServiceContext = createContext<any>(
  new DevelopmentFileService()
);

export const useFs = () => {
  const context = useContext(FileServiceContext);
  if (!context) {
    throw new Error("useFileService must be used within a FileServiceProvider");
  }
  // Return as an array to make it iterable
  return [context];
};
