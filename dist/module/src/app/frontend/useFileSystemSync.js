"use strict";
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState, useEffect, useCallback } from "react";
// import { useWebSocket } from "../App";
// // Remove any imports that might import backend-specific code
// export interface FileEntry {
//   name: string;
//   type: "folder" | "file";
//   path: string;
// }
// export interface FileSystemState {
//   files: Record<string, FileEntry[]>;
//   fileContents: Record<string, string>;
// }
// export const useFileSystemSync = (initialPath = "/") => {
//   const [fileSystem, setFileSystem] = useState<FileSystemState>({
//     files: {},
//     fileContents: {},
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const wsContext = useWebSocket();
//   const ws = wsContext?.ws;
//   const listDirectory = useCallback(async (project: string) => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Use the project tree endpoint
//       const response = await fetch(
//         `/api/projects/tree?project=${encodeURIComponent(project)}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         // The API should return { sourceFiles: [...] }
//         const items = data.sourceFiles || data;
//         setFileSystem((prev) => ({
//           ...prev,
//           files: {
//             ...prev.files,
//             [project]: items,
//           },
//         }));
//         setLoading(false);
//         return items;
//       } else {
//         throw new Error(`Failed to list directory: ${response.status}`);
//       }
//     } catch (error) {
//       const errorMessage =
//         error instanceof Error ? error.message : "Unknown error";
//       console.error("Error listing directory:", error);
//       setError(errorMessage);
//       setLoading(false);
//       throw error;
//     }
//   }, []);
//   const readFile = useCallback(async (path: string) => {
//     try {
//       // Use the read file endpoint
//       const response = await fetch(
//         `/api/files/read?path=${encodeURIComponent(path)}`
//       );
//       if (response.ok) {
//         const content = await response.text();
//         setFileSystem((prev) => ({
//           ...prev,
//           fileContents: {
//             ...prev.fileContents,
//             [path]: content,
//           },
//         }));
//         return content;
//       } else {
//         throw new Error(`Failed to read file: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Error reading file:", error);
//       throw error;
//     }
//   }, []);
//   useEffect(() => {
//     if (!ws) return;
//     const handleMessage = (event: MessageEvent) => {
//       try {
//         const data = JSON.parse(event.data);
//         if (data.type === "fileChanged") {
//           setFileSystem((prev) => ({
//             ...prev,
//             fileContents: {
//               ...prev.fileContents,
//               [data.path]: data.content,
//             },
//           }));
//         }
//       } catch (error) {
//         console.error("Error processing WebSocket message:", error);
//       }
//     };
//     ws.addEventListener("message", handleMessage);
//     return () => ws.removeEventListener("message", handleMessage);
//   }, [ws]);
//   return {
//     fileSystem,
//     listDirectory,
//     readFile,
//     refresh: () => listDirectory(initialPath),
//   };
// };
