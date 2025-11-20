"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkriboPage = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importDefault(require("react"));
// import { GenericTree } from './GenericXMLEditor/GenericTree';
// import { GenericPreview } from './GenericXMLEditor/GenericPreview';
// import { GenericTextEditor } from './GenericXMLEditor/GenericTextEditor';
// import { AttributeEditor } from './GenericXMLEditor/AttributeEditor';
// import { XMLNode } from './GenericXMLEditorPage';
const SkriboPage = () => {
    // const [code, setCode] = useState<string>('// Write your code here\nfunction hello() {\n  console.log("Hello, world!");\n}');
    // const [language, setLanguage] = useState<string>('javascript');
    // const [fileTreeWidth, setFileTreeWidth] = useState(250);
    // const [editorWidth, setEditorWidth] = useState(600);
    // const [previewWidth, setPreviewWidth] = useState(400);
    // const [isResizing, setIsResizing] = useState(false);
    // const [resizeType, setResizeType] = useState<'fileTree' | 'editor' | 'preview' | null>(null);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentPath, setCurrentPath] = useState<string>('');
    // const [fileTree, setFileTree] = useState<any[]>([]);
    // const [canUndo, setCanUndo] = useState(false);
    // const [canRedo, setCanRedo] = useState(false);
    // const containerRef = useRef<HTMLDivElement>(null);
    // // Sample XML tree data for the GenericXMLEditor components
    // const [xmlTree, setXmlTree] = useState<XMLNode>({
    //   id: 'root',
    //   type: 'svg',
    //   attributes: { width: '100', height: '100' },
    //   children: [
    //     {
    //       id: 'rect1',
    //       type: 'rect',
    //       attributes: { x: '10', y: '10', width: '80', height: '80', fill: 'red' },
    //       children: []
    //     }
    //   ]
    // });
    // const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    // const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
    // // Find the selected node
    // const findNode = (node: XMLNode, id: string): XMLNode | null => {
    //   if (node.id === id) return node;
    //   for (const child of node.children) {
    //     const found = findNode(child, id);
    //     if (found) return found;
    //   }
    //   return null;
    // };
    // const selectedNode = selectedNodeId ? findNode(xmlTree, selectedNodeId) : null;
    // const handleUpdateNode = (nodeId: string, attributes: Record<string, string>) => {
    //   const updateNode = (node: XMLNode): XMLNode => {
    //     if (node.id === nodeId) {
    //       return { ...node, attributes };
    //     }
    //     return {
    //       ...node,
    //       children: node.children.map(updateNode)
    //     };
    //   };
    //   setXmlTree(updateNode(xmlTree));
    // };
    // const handleEditorChange = (value: string | undefined) => {
    //   setCode(value || '');
    // };
    // // Handle horizontal scroll when over the editor
    // const handleEditorDidMount = (editor: any, monaco: any) => {
    //   // Add event listener to the editor container to handle horizontal scrolling
    //   const editorContainer = editor.getDomNode();
    //   if (editorContainer) {
    //     editorContainer.addEventListener('wheel', (event: WheelEvent) => {
    //       // Check if it's a horizontal scroll
    //       if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
    //         // Prevent the default behavior to allow horizontal scrolling of the parent
    //         event.preventDefault();
    //         // Scroll the container horizontally
    //         if (containerRef.current) {
    //           containerRef.current.scrollLeft += event.deltaX;
    //         }
    //       }
    //     }, { passive: false });
    //   }
    // };
    // const handleUndo = () => {
    //   // Implement undo functionality
    //   console.log('Undo');
    // };
    // const handleRedo = () => {
    //   // Implement redo functionality
    //   console.log('Redo');
    // };
    // const startResizing = (type: 'fileTree' | 'editor' | 'treeView' | 'attributes' | 'textEditor' | 'preview') => {
    //   setIsResizing(true);
    //   setResizeType(type);
    // };
    // useEffect(() => {
    //   // Load file tree based on mode
    //   const loadFileTree = async () => {
    //     setIsLoading(true);
    //     try {
    //       const isDevelopment = process.env.NODE_ENV === 'development';
    //       if (isDevelopment) {
    //         // Try to use FileService first
    //         try {
    //           const { getFileService } = await import('../../services/FileService');
    //           const fileService = getFileService('dev');
    //           // Read the root directory
    //           const rootContent = await fileService.readDirectory('/');
    //           // Process the directory content to build a proper tree structure
    //           const processedTree = await processDirectoryContent('/', rootContent, fileService);
    //           setFileTree(processedTree);
    //         } catch (fileServiceError) {
    //           console.warn('FileService directory listing not available, trying API:', fileServiceError);
    //           try {
    //             const response = await fetch('/api/files/tree');
    //             if (response.ok) {
    //               const tree = await response.json();
    //               setFileTree(tree);
    //             } else {
    //               throw new Error(`API returned ${response.status}`);
    //             }
    //           } catch (apiError) {
    //             console.warn('API endpoint not available, trying direct file system access:', apiError);
    //             // Fall back to direct file system access using Node.js fs module
    //             await loadFileTreeFromFileSystem();
    //           }
    //         }
    //       } else {
    //         // In static mode, use isomorphic-git to get file tree
    //         await loadFileTreeFromGit();
    //       }
    //     } catch (error) {
    //       console.error('Failed to load file tree:', error);
    //       // Fall back to sample structure
    //       setFileTree(getSampleFileTree());
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    //   const processDirectoryContent = async (currentPath: string, items: any[], fileService: any): Promise<any[]> => {
    //     const result: any[] = [];
    //     for (const item of items) {
    //       if (item.type === 'folder') {
    //         try {
    //           // Recursively process subdirectories
    //           const children = await fileService.readDirectory(item.path);
    //           const processedChildren = await processDirectoryContent(item.path, children, fileService);
    //           result.push({
    //             name: item.name,
    //             type: 'folder',
    //             path: item.path,
    //             children: processedChildren
    //           });
    //         } catch (error) {
    //           console.warn(`Failed to read directory ${item.path}:`, error);
    //           result.push({
    //             name: item.name,
    //             type: 'folder',
    //             path: item.path,
    //             children: []
    //           });
    //         }
    //       } else {
    //         result.push({
    //           name: item.name,
    //           type: 'file',
    //           path: item.path
    //         });
    //       }
    //     }
    //     return result;
    //   };
    //   const loadFileTreeFromFileSystem = async () => {
    //     try {
    //       const fs = await import('fs');
    //       const path = await import('path');
    //       const readDirRecursive = async (dirPath: string, basePath: string = ''): Promise<any[]> => {
    //         const items: any[] = [];
    //         const fullPath = path.join(dirPath, basePath);
    //         try {
    //           const entries = await fs.promises.readdir(fullPath, { withFileTypes: true });
    //           for (const entry of entries) {
    //             // Skip hidden files and directories (like .git, .DS_Store)
    //             if (entry.name.startsWith('.')) continue;
    //             const relativePath = path.join(basePath, entry.name);
    //             if (entry.isDirectory()) {
    //               const children = await readDirRecursive(dirPath, relativePath);
    //               items.push({
    //                 name: entry.name,
    //                 type: 'folder',
    //                 path: '/' + relativePath,
    //                 children
    //               });
    //             } else if (entry.isFile()) {
    //               items.push({
    //                 name: entry.name,
    //                 type: 'file',
    //                 path: '/' + relativePath
    //               });
    //             }
    //           }
    //         } catch (error) {
    //           console.warn(`Failed to read directory ${fullPath}:`, error);
    //         }
    //         return items;
    //       };
    //       const tree = await readDirRecursive(process.cwd());
    //       setFileTree(tree);
    //     } catch (error) {
    //       console.error('Failed to load file tree from file system:', error);
    //       throw error;
    //     }
    //   };
    //   const loadFileTreeFromGit = async () => {
    //     try {
    //       const git = await import('isomorphic-git');
    //       const fs = await import('fs');
    //       // Get the list of files from git
    //       const files = await git.listFiles({
    //         fs,
    //         dir: process.cwd(),
    //         ref: 'HEAD'
    //       });
    //       // Convert flat file list to hierarchical structure
    //       const tree = buildFileTree(files);
    //       setFileTree(tree);
    //     } catch (error) {
    //       console.error('Failed to load file tree from git:', error);
    //       // Fall back to file system access
    //       await loadFileTreeFromFileSystem();
    //     }
    //   };
    //   const buildFileTree = (files: string[]): any[] => {
    //     const root: Record<string, any> = {};
    //     files.forEach(filePath => {
    //       // Skip git-related files
    //       if (filePath.startsWith('.git/')) return;
    //       const parts = filePath.split('/');
    //       let current = root;
    //       for (let i = 0; i < parts.length; i++) {
    //         const part = parts[i];
    //         const isFile = i === parts.length - 1;
    //         if (!current[part]) {
    //           if (isFile) {
    //             current[part] = {
    //               name: part,
    //               type: 'file',
    //               path: '/' + filePath
    //             };
    //           } else {
    //             current[part] = {
    //               name: part,
    //               type: 'folder',
    //               path: '/' + parts.slice(0, i + 1).join('/'),
    //               children: {}
    //             };
    //           }
    //         }
    //         if (!isFile) {
    //           current = current[part].children;
    //         }
    //       }
    //     });
    //     // Convert the object structure to an array
    //     const convertToArray = (obj: Record<string, any>): any[] => {
    //       return Object.values(obj).map(item => {
    //         if (item.type === 'folder') {
    //           return {
    //             ...item,
    //             children: convertToArray(item.children)
    //           };
    //         }
    //         return item;
    //       });
    //     };
    //     return convertToArray(root);
    //   };
    //   const getSampleFileTree = () => {
    //     return [
    //       {
    //         name: 'src', 
    //         type: 'folder', 
    //         path: '/src',
    //         children: [
    //           { name: 'index.js', type: 'file', path: '/src/index.js' },
    //           { name: 'app.js', type: 'file', path: '/src/app.js' },
    //           {
    //             name: 'components', 
    //             type: 'folder', 
    //             path: '/src/components',
    //             children: [
    //               { name: 'Button.js', type: 'file', path: '/src/components/Button.js' },
    //               { name: 'Header.js', type: 'file', path: '/src/components/Header.js' }
    //             ]
    //           }
    //         ]
    //       },
    //       { name: 'package.json', type: 'file', path: '/package.json' },
    //       { name: 'README.md', type: 'file', path: '/README.md' }
    //     ];
    //   };
    //   loadFileTree();
    // }, []);
    // useEffect(() => {
    //   const handleMouseMove = (e: MouseEvent) => {
    //     if (!isResizing || !containerRef.current) return;
    //     const containerRect = containerRef.current.getBoundingClientRect();
    //     const relativeX = e.clientX - containerRect.left;
    //     if (resizeType === 'fileTree') {
    //       const newWidth = Math.max(200, Math.min(relativeX, 800));
    //       setFileTreeWidth(newWidth);
    //     } else if (resizeType === 'editor') {
    //       const newWidth = Math.max(200, Math.min(relativeX - fileTreeWidth, 800));
    //       setEditorWidth(newWidth);
    //     } else if (resizeType === 'editor') {
    //       const newWidth = Math.max(200, Math.min(relativeX - fileTreeWidth, 800));
    //       setEditorWidth(newWidth);
    //     } else if (resizeType === 'preview') {
    //       const newWidth = Math.max(200, Math.min(relativeX - fileTreeWidth - editorWidth, 800));
    //       setPreviewWidth(newWidth);
    //     }
    //   };
    //   const handleMouseUp = () => {
    //     setIsResizing(false);
    //     setResizeType(null);
    //   };
    //   if (isResizing) {
    //     document.addEventListener('mousemove', handleMouseMove);
    //     document.addEventListener('mouseup', handleMouseUp);
    //   }
    //   return () => {
    //     document.removeEventListener('mousemove', handleMouseMove);
    //     document.removeEventListener('mouseup', handleMouseUp);
    //   };
    // }, [isResizing, resizeType, fileTreeWidth, editorWidth]);
    // const loadFileContent = async (filePath: string) => {
    //   try {
    //     setIsLoading(true);
    //     // Determine the mode based on the environment
    //     const isDevelopment = process.env.NODE_ENV === 'development';
    //     if (isDevelopment) {
    //       // In development mode, try multiple approaches to load file content
    //       try {
    //         // First try FileService
    //         const { getFileService } = await import('../../services/FileService');
    //         const fileService = getFileService('dev');
    //         const content = await fileService.readFile(filePath);
    //         setCode(content);
    //         setCurrentPath(filePath);
    //       } catch (fileServiceError) {
    //         console.warn('FileService not available, trying API endpoint:', fileServiceError);
    //         try {
    //           // Try API endpoint
    //           const encodedPath = encodeURIComponent(filePath);
    //           const response = await fetch(`/api/files/read?path=${encodedPath}`);
    //           if (response.ok) {
    //             const content = await response.text();
    //             setCode(content);
    //             setCurrentPath(filePath);
    //           } else {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //           }
    //         } catch (apiError) {
    //           console.warn('API endpoint not available, trying direct file system access:', apiError);
    //           // Fall back to direct file system access
    //           await loadFileContentFromFileSystem(filePath);
    //         }
    //       }
    //     } else {
    //       // In production/static mode, use isomorphic-git to fetch from GitHub
    //       await loadFileContentFromGit(filePath);
    //     }
    //     // Set language based on file extension
    //     updateLanguageFromFilePath(filePath);
    //   } catch (error) {
    //     console.error('Failed to load file:', error);
    //     setCode(`// Error loading file: ${filePath}\n// ${error instanceof Error ? error.message : 'Unknown error'}`);
    //     setCurrentPath(filePath);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // const loadFileContentFromFileSystem = async (filePath: string) => {
    //   try {
    //     const fs = await import('fs');
    //     const path = await import('path');
    //     // Remove leading slash if present
    //     const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    //     const fullPath = path.join(process.cwd(), cleanPath);
    //     const content = await fs.promises.readFile(fullPath, 'utf-8');
    //     setCode(content);
    //     setCurrentPath(filePath);
    //   } catch (error) {
    //     console.error('Direct file system load failed:', error);
    //     throw error;
    //   }
    // };
    // const loadFileContentDirect = async (filePath: string) => {
    //   try {
    //     let fetchPath = filePath;
    //     if (fetchPath.startsWith('/')) {
    //       fetchPath = fetchPath.slice(1);
    //     }
    //     const cacheBuster = `?cb=${Date.now()}`;
    //     const response = await fetch(fetchPath + cacheBuster);
    //     if (response.ok) {
    //       const content = await response.text();
    //       setCode(content);
    //       setCurrentPath(filePath);
    //     } else {
    //       throw new Error(`File not found (${response.status})`);
    //     }
    //   } catch (error) {
    //     console.error('Direct file load failed:', error);
    //     setCode(`// File: ${filePath}\n// ${error instanceof Error ? error.message : 'Content not available'}\n\n// Add your code here`);
    //     setCurrentPath(filePath);
    //   }
    // };
    // const loadFileContentFromGit = async (filePath: string) => {
    //   try {
    //     // Import isomorphic-git
    //     const git = await import('isomorphic-git');
    //     const fs = await import('fs');
    //     // Remove leading slash if present
    //     const gitPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
    //     // Read file from git repository
    //     // Note: This assumes the repository is already cloned locally
    //     // In a real implementation, you'd need to handle the repository setup
    //     const content = await git.readBlob({
    //       fs,
    //       dir: process.cwd(), // Current working directory (where the git repo is)
    //       oid: 'HEAD', // Read from the latest commit
    //       filepath: gitPath
    //     });
    //     // Convert Uint8Array to string
    //     const text = new TextDecoder().decode(content.blob);
    //     setCode(text);
    //     setCurrentPath(filePath);
    //   } catch (error) {
    //     console.error('Failed to load file from git:', error);
    //     // Fall back to direct fetch
    //     await loadFileContentDirect(filePath);
    //   }
    // };
    // const updateLanguageFromFilePath = (filePath: string) => {
    //   const extension = filePath.split('.').pop()?.toLowerCase();
    //   const languageMap: Record<string, string> = {
    //     'js': 'javascript',
    //     'jsx': 'javascript',
    //     'ts': 'typescript',
    //     'tsx': 'typescript',
    //     'py': 'python',
    //     'html': 'html',
    //     'css': 'css',
    //     'scss': 'scss',
    //     'sass': 'sass',
    //     'json': 'json',
    //     'md': 'markdown',
    //     'xml': 'xml',
    //     'svg': 'xml',
    //     'go': 'go',
    //     'java': 'java',
    //     'cpp': 'cpp',
    //     'c': 'c',
    //     'cs': 'csharp',
    //     'php': 'php',
    //     'rb': 'ruby',
    //     'rs': 'rust',
    //     'sh': 'shell',
    //     'bash': 'shell',
    //     'bat': 'bat',
    //     'ps1': 'powershell',
    //     'sql': 'sql',
    //     'yaml': 'yaml',
    //     'yml': 'yaml',
    //     'toml': 'toml',
    //     'ini': 'ini',
    //     'cfg': 'ini',
    //     'conf': 'ini'
    //   };
    //   setLanguage(languageMap[extension || ''] || 'plaintext');
    // };
    // const renderFileTree = (items: any[]) => {
    //   return (
    //     <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
    //       {items.map((item, index) => (
    //         <li key={index} style={{ marginBottom: '0.25rem' }}>
    //           <div 
    //             className="d-flex align-items-center"
    //             style={{ cursor: item.type === 'file' ? 'pointer' : 'default' }}
    //             onClick={() => {
    //               if (item.type === 'file') {
    //                 loadFileContent(item.path);
    //               }
    //             }}
    //           >
    //             <span className="me-1">
    //               {item.type === 'folder' ? '📁 ' : '📄 '}
    //             </span>
    //             <span className="small">{item.name}</span>
    //           </div>
    //           {item.type === 'folder' && item.children && (
    //             <div style={{ marginLeft: '1rem' }}>
    //               {renderFileTree(item.children)}
    //             </div>
    //           )}
    //         </li>
    //       ))}
    //     </ul>
    //   );
    // };
    return (react_1.default.createElement("div", null, "IDK"));
};
exports.SkriboPage = SkriboPage;
