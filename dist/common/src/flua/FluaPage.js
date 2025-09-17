"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FluaPage = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const react_1 = __importStar(require("react"));
const react_dnd_1 = require("react-dnd");
const react_dnd_html5_backend_1 = require("react-dnd-html5-backend");
const GenericXMLEditorPage_1 = require("../components/stateful/GenericXMLEditorPage");
const AttributeEditor_1 = require("../components/stateful/GenericXMLEditor/AttributeEditor");
// Function to parse XML string to XMLNode structure
const parseXmlToNode = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const parseElement = (element) => {
        var _a;
        // Get attributes
        const attributes = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
        }
        // Process children
        const children = [];
        let textContent;
        for (let i = 0; i < element.childNodes.length; i++) {
            const node = element.childNodes[i];
            if (node.nodeType === Node.ELEMENT_NODE) {
                children.push(parseElement(node));
            }
            else if (node.nodeType === Node.TEXT_NODE && ((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim())) {
                textContent = (textContent || '') + node.textContent;
            }
        }
        // Trim text content if it exists
        if (textContent) {
            textContent = textContent.trim();
        }
        return {
            id: `${element.nodeName}-${Date.now()}-${Math.random()}`,
            type: element.nodeName,
            attributes,
            children,
            textContent: textContent || undefined
        };
    };
    // Get the root element
    const rootElement = xmlDoc.documentElement;
    return parseElement(rootElement);
};
// Function to load XML file
const loadXmlFile = async (filePath) => {
    try {
        const response = await fetch(`/api/files/read?path=${encodeURIComponent(filePath)}`);
        if (!response.ok) {
            throw new Error(`Failed to load XML file: ${response.statusText}`);
        }
        const xmlContent = await response.text();
        return parseXmlToNode(xmlContent);
    }
    catch (error) {
        console.error('Error loading XML file:', error);
        throw error;
    }
};
// Define node types based on the XSD
const nodeTypes = [
    { label: "Kanban Process", type: "kanban:KanbanProcess" },
    { label: "Metadata", type: "core:Metadata" },
    { label: "Version", type: "core:Version" },
    { label: "Date Created", type: "core:DateCreated" },
    { label: "Description", type: "core:Description" },
    { label: "GraphML", type: "graphml:graphml" },
    { label: "Key", type: "graphml:key" },
    { label: "Graph", type: "graphml:graph" },
    { label: "Node", type: "graphml:node" },
    { label: "Data", type: "graphml:data" },
    { label: "Edge", type: "graphml:edge" },
];
// Function to create a new node
const createKanbanNode = (parentId, nodeType) => {
    const id = `${nodeType}-${Date.now()}`;
    const baseNode = {
        id,
        type: nodeType,
        attributes: {},
        children: [],
    };
    // Add type-specific attributes
    switch (nodeType) {
        case "graphml:key":
            baseNode.attributes = {
                id: "new-key",
                for: "node",
                "attr.name": "",
                "attr.type": "string",
            };
            break;
        case "graphml:node":
            baseNode.attributes = { id: `node-${Date.now()}` };
            break;
        case "graphml:data":
            baseNode.attributes = { key: "name" };
            break;
        case "graphml:edge":
            baseNode.attributes = { source: "", target: "" };
            break;
        // Add more cases as needed
    }
    return baseNode;
};
// Draggable Kanban Card Component
const KanbanCard = ({ task, status, onMoveTask }) => {
    const [{ isDragging }, drag] = (0, react_dnd_1.useDrag)(() => ({
        type: "task",
        item: { id: task.id, status },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return (react_1.default.createElement("div", { ref: drag, className: "kanban-card", style: {
            background: "#fff",
            borderRadius: "4px",
            padding: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
            opacity: isDragging ? 0.5 : 1,
            cursor: "move",
        } },
        react_1.default.createElement("div", { style: { fontWeight: "bold", marginBottom: "8px" } }, task.name),
        react_1.default.createElement("div", { style: { fontSize: "0.875rem", color: "#666" } }, task.role)));
};
// Kanban Column Component
const KanbanColumn = ({ status, tasks, onMoveTask }) => {
    const [{ isOver }, drop] = (0, react_dnd_1.useDrop)(() => ({
        accept: "task",
        drop: (item) => {
            if (item.status !== status) {
                onMoveTask(item.id, status);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));
    return (react_1.default.createElement("div", { ref: drop, className: "kanban-column", style: {
            minWidth: "250px",
            background: isOver ? "#e6f7ff" : "#f4f5f7",
            borderRadius: "8px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            transition: "background 0.2s ease",
        } },
        react_1.default.createElement("h6", { style: {
                margin: "0 0 12px 0",
                padding: "8px",
                background: "#fff",
                borderRadius: "4px",
            } },
            status,
            " (",
            tasks.length,
            ")"),
        react_1.default.createElement("div", { style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "8px",
            } }, tasks.map((task) => (react_1.default.createElement(KanbanCard, { key: task.id, task: task, status: status, onMoveTask: onMoveTask }))))));
};
// Kanban board preview component
const KanbanBoardPreview = ({ xmlTree, onTreeUpdate }) => {
    const [tasks, setTasks] = (0, react_1.useState)([]);
    console.log("mark1", KanbanBoardPreview);
    // Find the graphml node which contains the tasks
    const findGraphmlNode = react_1.default.useCallback((node) => {
        if (node.type === "graphml:graphml")
            return node;
        for (const child of node.children) {
            const result = findGraphmlNode(child);
            if (result)
                return result;
        }
        return null;
    }, []);
    // Extract tasks from the graphml structure
    const extractTasks = react_1.default.useCallback((graphmlNode) => {
        if (!graphmlNode)
            return [];
        // Find the graph node
        const graphNode = graphmlNode.children.find((child) => child.type === "graphml:graph");
        if (!graphNode)
            return [];
        // Process each node to extract task information
        const tasks = graphNode.children
            .filter((child) => child.type === "graphml:node")
            .map((node) => {
            let task = {
                id: node.attributes.id || "",
                name: "",
                status: "",
                role: "",
            };
            // Extract data from child data nodes
            node.children.forEach((dataNode) => {
                if (dataNode.type === "graphml:data") {
                    const key = dataNode.attributes.key;
                    const value = dataNode.textContent || "";
                    switch (key) {
                        case "name":
                            task.name = value;
                            break;
                        case "status":
                            task.status = value;
                            break;
                        case "role":
                            task.role = value;
                            break;
                    }
                }
            });
            return task;
        });
        return tasks;
    }, []);
    // Update tasks whenever xmlTree changes
    react_1.default.useEffect(() => {
        const graphmlNode = findGraphmlNode(xmlTree);
        const extractedTasks = extractTasks(graphmlNode);
        setTasks(extractedTasks);
    }, [xmlTree, findGraphmlNode, extractTasks]);
    // Handle moving tasks between statuses
    const handleMoveTask = (taskId, newStatus) => {
        // Deep clone the xmlTree
        const newTree = JSON.parse(JSON.stringify(xmlTree));
        // Find the task node and update its status data
        const updateStatusInTree = (node) => {
            if (node.type === "graphml:node" && node.attributes.id === taskId) {
                // Find the status data child and update its textContent
                for (const child of node.children) {
                    if (child.type === "graphml:data" &&
                        child.attributes.key === "status") {
                        child.textContent = newStatus;
                        return true;
                    }
                }
                // If status data doesn't exist, create it
                const statusDataNode = {
                    id: `status-${Date.now()}`,
                    type: "graphml:data",
                    attributes: { key: "status" },
                    children: [],
                    textContent: newStatus
                };
                node.children.push(statusDataNode);
                return true;
            }
            for (const child of node.children) {
                if (updateStatusInTree(child)) {
                    return true;
                }
            }
            return false;
        };
        if (updateStatusInTree(newTree)) {
            // Update the tree using the provided callback
            onTreeUpdate(newTree);
            // Update the local state to show the drag and drop working
            setTasks((prevTasks) => prevTasks.map((task) => task.id === taskId ? Object.assign(Object.assign({}, task), { status: newStatus }) : task));
        }
    };
    // Group tasks by status - use a more reliable approach
    const statusGroups = react_1.default.useMemo(() => {
        const groups = {};
        tasks.forEach((task) => {
            if (!groups[task.status]) {
                groups[task.status] = [];
            }
            groups[task.status].push(task);
        });
        return groups;
    }, [tasks]);
    // Define column order
    const statusOrder = ["To Do", "In Progress", "Done"];
    return (react_1.default.createElement(react_dnd_1.DndProvider, { backend: react_dnd_html5_backend_1.HTML5Backend },
        react_1.default.createElement("div", { className: "kanban-board", style: {
                display: "flex",
                gap: "16px",
                padding: "16px",
                height: "100%",
                overflowX: "auto",
            } }, statusOrder.map((status) => {
            const columnTasks = statusGroups[status] || [];
            return (react_1.default.createElement(KanbanColumn, { key: status, status: status, tasks: columnTasks, onMoveTask: handleMoveTask }));
        }))));
};
// Custom preview renderer for the Kanban board
const renderKanbanPreview = (node, isSelected, eventHandlers, onTreeUpdate) => {
    // Always render the Kanban board - the node parameter is always the root xmlTree
    return (react_1.default.createElement("div", Object.assign({ style: {
            height: "100%",
            width: "100%",
        } }, eventHandlers),
        react_1.default.createElement(KanbanBoardPreview, { xmlTree: node, onTreeUpdate: onTreeUpdate })));
};
const FluaPage = () => {
    const [initialTree, setInitialTree] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const loadKanbanProcess = async () => {
            try {
                setLoading(true);
                const tree = await loadXmlFile('example/single-kanban-process.xml');
                setInitialTree(tree);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load XML');
                console.error('Error loading kanban process:', err);
            }
            finally {
                setLoading(false);
            }
        };
        loadKanbanProcess();
    }, []);
    if (loading) {
        return react_1.default.createElement("div", null, "Loading kanban process...");
    }
    if (error) {
        throw error;
        // console.warn('Using fallback data due to error:', error);
        // // Fallback to using the hardcoded data structure
        // const fallbackTree: XMLNode = {
        //   id: "root",
        //   type: "kanban:KanbanProcess",
        //   attributes: {
        //     "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        //     "xmlns:kanban": "http://example.com/businessprocess/agile/kanban",
        //     "xmlns:core": "http://example.com/businessprocess/core",
        //     "xmlns:graphml": "http://graphml.graphdrawing.org/xmlns",
        //     "xsi:schemaLocation":
        //       "http://example.com/businessprocess/agile/kanban ../src/flua/kanban.xsd\n                      http://example.com/businessprocess/core ../src/flua/core.xsd\n                      http://graphml.graphdrawing.org/xmlns ../src/graphml.xsd",
        //     id: "marketing-website-kanban",
        //     name: "Marketing Website Kanban Board",
        //     wipLimit: "3",
        //   },
        //   children: [
        //     {
        //       id: "metadata",
        //       type: "core:Metadata",
        //       attributes: {},
        //       children: [
        //         {
        //           id: "version",
        //           type: "core:Version",
        //           attributes: {},
        //           children: [],
        //           textContent: "1.0",
        //         },
        //         {
        //           id: "date-created",
        //           type: "core:DateCreated",
        //           attributes: {},
        //           children: [],
        //           textContent: "2025-09-16",
        //         },
        //       ],
        //     },
        //     {
        //       id: "description",
        //       type: "core:Description",
        //       attributes: {},
        //       children: [],
        //       textContent:
        //         "Kanban board for managing tasks related to the marketing website.",
        //     },
        //     {
        //       id: "graphml",
        //       type: "graphml:graphml",
        //       attributes: {},
        //       children: [
        //         {
        //           id: "key-name",
        //           type: "graphml:key",
        //           attributes: {
        //             id: "name",
        //             for: "node",
        //             "attr.name": "name",
        //             "attr.type": "string",
        //           },
        //           children: [],
        //         },
        //         {
        //           id: "key-status",
        //           type: "graphml:key",
        //           attributes: {
        //             id: "status",
        //             for: "node",
        //             "attr.name": "status",
        //             "attr.type": "string",
        //           },
        //           children: [],
        //         },
        //         {
        //           id: "key-role",
        //           type: "graphml:key",
        //           attributes: {
        //             id: "role",
        //             for: "node",
        //             "attr.name": "role",
        //             "attr.type": "string",
        //           },
        //           children: [],
        //         },
        //         {
        //           id: "graph",
        //           type: "graphml:graph",
        //           attributes: {
        //             id: "kanban-tasks",
        //             edgedefault: "directed",
        //           },
        //           children: [
        //             {
        //               id: "task-seo-audit",
        //               type: "graphml:node",
        //               attributes: { id: "task-seo-audit" },
        //               children: [
        //                 {
        //                   id: "data-name-1",
        //                   type: "graphml:data",
        //                   attributes: { key: "name" },
        //                   children: [],
        //                   textContent: "Conduct SEO audit",
        //                 },
        //                 {
        //                   id: "data-status-1",
        //                   type: "graphml:data",
        //                   attributes: { key: "status" },
        //                   children: [],
        //                   textContent: "To Do",
        //                 },
        //                 {
        //                   id: "data-role-1",
        //                   type: "graphml:data",
        //                   attributes: { key: "role" },
        //                   children: [],
        //                   textContent: "Marketing Specialist",
        //                 },
        //               ],
        //             },
        //             {
        //               id: "task-blog-post",
        //               type: "graphml:node",
        //               attributes: { id: "task-blog-post" },
        //               children: [
        //                 {
        //                   id: "data-name-2",
        //                   type: "graphml:data",
        //                   attributes: { key: "name" },
        //                   children: [],
        //                   textContent: "Write blog post on new feature",
        //                 },
        //                 {
        //                   id: "data-status-2",
        //                   type: "graphml:data",
        //                   attributes: { key: "status" },
        //                   children: [],
        //                   textContent: "To Do",
        //                 },
        //                 {
        //                   id: "data-role-2",
        //                   type: "graphml:data",
        //                   attributes: { key: "role" },
        //                   children: [],
        //                   textContent: "Content Writer",
        //                 },
        //               ],
        //             },
        //             {
        //               id: "edge-1",
        //               type: "graphml:edge",
        //               attributes: {
        //                 source: "task-landing-page",
        //                 target: "task-implement-ui",
        //               },
        //               children: [],
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // };
        // return (
        //   <DndProvider backend={HTML5Backend}>
        //     <GenericXMLEditorPage
        //       initialTree={fallbackTree}
        //       renderPreview={renderKanbanPreview}
        //       attributeEditor={(node, onUpdateAttributes, onUpdateTextContent) => {
        //         return (
        //           <AttributeEditor
        //             node={node}
        //             onUpdateAttributes={onUpdateAttributes}
        //             onUpdateTextContent={onUpdateTextContent}
        //           />
        //         );
        //       }}
        //       nodeTypes={nodeTypes}
        //       onAddNode={createKanbanNode}
        //     />
        //   </DndProvider>
        // );
    }
    if (!initialTree) {
        return react_1.default.createElement("div", null, "No XML data available");
    }
    return (react_1.default.createElement(react_dnd_1.DndProvider, { backend: react_dnd_html5_backend_1.HTML5Backend },
        react_1.default.createElement(GenericXMLEditorPage_1.GenericXMLEditorPage, { initialTree: initialTree, renderPreview: renderKanbanPreview, attributeEditor: (node, onUpdateAttributes, onUpdateTextContent) => {
                console.log("attributeEditor called with:", {
                    node,
                    onUpdateAttributes,
                    onUpdateTextContent,
                });
                return (react_1.default.createElement(AttributeEditor_1.AttributeEditor, { node: node, onUpdateAttributes: onUpdateAttributes, onUpdateTextContent: onUpdateTextContent }));
            }, nodeTypes: nodeTypes, onAddNode: createKanbanNode })));
};
exports.FluaPage = FluaPage;
