/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { SVGAttributesEditor } from "./SVGEditor/SVGAttributesEditor";
import { SVGElementForm } from "./SVGEditor/SVGElementForm";
import { XMLNode, GenericXMLEditorPage } from "./GenericXMLEditorPage";
import { SVGPreview } from "./SVGEditor/SVGPreview";

export interface SVGNode {
  id: string;
  type: string;
  attributes: Record<string, string>;
  children: SVGNode[];
}

export const SVGEditorPage = () => {
  const initialTree: XMLNode = {
    id: "root",
    type: "svg",
    attributes: {
      width: "400",
      height: "400",
      viewBox: "0 0 400 400",
      xmlns: "http://www.w3.org/2000/svg",
    },
    children: [
      {
        id: "rect-1",
        type: "rect",
        attributes: {
          x: "50",
          y: "50",
          width: "100",
          height: "100",
          fill: "blue",
          stroke: "black",
          "stroke-width": "2",
        },
        children: [],
      }
    ],
  };

  const [svgTree, setSvgTree] = useState<SVGNode>(initialTree);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [history, setHistory] = useState<SVGNode[]>([initialTree]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [editMode, setEditMode] = useState<
    "none" | "move" | "scale" | "rotate"
  >("none");
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
  const [dragInfo, setDragInfo] = useState<{
    isDragging: boolean;
    nodeId: string | null;
  }>({
    isDragging: false,
    nodeId: null,
  });

  // Find a node by ID
  const findNode = useCallback((node: SVGNode, id: string): SVGNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  // Helper to update tree and manage history
  const updateTree = useCallback(
    (newTree: SVGNode) => {
      setSvgTree(newTree);
      // Add to history, truncating future history if we're not at the end
      setHistory((prevHistory) => {
        const newHistory = prevHistory.slice(0, historyIndex + 1);
        newHistory.push(newTree);
        return newHistory;
      });
      setHistoryIndex((prevIndex) => prevIndex + 1);
    },
    [historyIndex]
  );

  // Update node attributes
  const updateNodeAttributes = useCallback(
    (nodeId: string, attributes: Record<string, string>) => {
      setSvgTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const node = findNode(newTree, nodeId);
        if (node) {
          node.attributes = { ...node.attributes, ...attributes };
        }
        updateTree(newTree);
        return newTree;
      });
    },
    [findNode, updateTree]
  );

  // Update node text content
  const updateNodeTextContent = useCallback(
    (nodeId: string, textContent: string) => {
      setSvgTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const node = findNode(newTree, nodeId);
        if (node) {
          // For text and tspan nodes, we need to handle text content
          // This is a simplified approach - in a real implementation, you'd track text content separately
          // For now, we'll add a special attribute to track the text content
          node.attributes['data-text-content'] = textContent;
        }
        updateTree(newTree);
        return newTree;
      });
    },
    [findNode, updateTree]
  );

  // Toggle node visibility
  const toggleNodeVisibility = useCallback((nodeId: string) => {
    setHiddenNodes((prev) => {
      const newHidden = new Set(prev);
      if (newHidden.has(nodeId)) {
        newHidden.delete(nodeId);
      } else {
        newHidden.add(nodeId);
      }
      return newHidden;
    });
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((nodeId: string) => {
    setDragInfo({ isDragging: true, nodeId });
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    setDragInfo({ isDragging: false, nodeId: null });
  }, []);

  // Move a node
  const moveNode = useCallback(
    (nodeId: string, newParentId: string | null, index: number) => {
      setSvgTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));

        // Find the node to move and its original parent
        let nodeToMove: SVGNode | null = null;
        let oldParent: SVGNode | null = null;

        const findNodeAndParent = (
          current: SVGNode,
          parent: SVGNode | null = null
        ): boolean => {
          if (current.id === nodeId) {
            nodeToMove = current;
            oldParent = parent;
            return true;
          }
          for (const child of current.children) {
            if (findNodeAndParent(child, current)) return true;
          }
          return false;
        };

        findNodeAndParent(newTree);

        if (!nodeToMove || !oldParent) return prevTree;

        // Remove from old parent
        oldParent.children = oldParent.children.filter(
          (child) => child.id !== nodeId
        );

        // Find new parent
        let targetParent: SVGNode | null = null;
        if (newParentId === null) {
          targetParent = newTree;
        } else {
          const findParent = (current: SVGNode): SVGNode | null => {
            if (current.id === newParentId) return current;
            for (const child of current.children) {
              const found = findParent(child);
              if (found) return found;
            }
            return null;
          };
          targetParent = findParent(newTree);
        }

        if (!targetParent) return prevTree;

        // Insert at specified index
        targetParent.children.splice(index, 0, nodeToMove);

        updateTree(newTree);
        return newTree;
      });
    },
    [updateTree]
  );

  // Add a new child node
  const addChildNode = useCallback(
    (parentId: string, nodeType: string) => {
      setSvgTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const parent = findNode(newTree, parentId);
        if (parent) {
          // Default attributes based on node type to make them visible
          let defaultAttributes: Record<string, string> = {};
          switch (nodeType) {
            case "rect":
              defaultAttributes = {
                x: "50",
                y: "50",
                width: "100",
                height: "100",
                fill: "blue",
                stroke: "black",
                "stroke-width": "2",
              };
              break;
            case "circle":
              defaultAttributes = {
                cx: "100",
                cy: "100",
                r: "50",
                fill: "red",
                stroke: "black",
                "stroke-width": "2",
              };
              break;
            case "path":
              defaultAttributes = {
                d: "M50 50 L150 150",
                stroke: "green",
                "stroke-width": "3",
                fill: "none",
              };
              break;
            case "text":
              defaultAttributes = {
                x: "50",
                y: "50",
                fill: "black",
                "font-size": "16",
              };
              break;
            case "g":
              defaultAttributes = {
                transform: "translate(0,0)",
              };
              break;
            default:
              defaultAttributes = {};
          }

          const newNode: SVGNode = {
            id: `${nodeType}-${Date.now()}`,
            type: nodeType,
            attributes: defaultAttributes,
            children: [],
          };
          parent.children = [...parent.children, newNode];
          setSelectedNodeId(newNode.id);
          updateTree(newTree);
        }
        return newTree;
      });
    },
    [findNode, updateTree]
  );

  // Remove a node
  const removeNode = useCallback(
    (nodeId: string) => {
      setSvgTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));

        // Function to remove node from its parent's children
        const removeFromParent = (node: SVGNode, targetId: string): boolean => {
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].id === targetId) {
              node.children.splice(i, 1);
              return true;
            }
            if (removeFromParent(node.children[i], targetId)) {
              return true;
            }
          }
          return false;
        };

        removeFromParent(newTree, nodeId);
        if (selectedNodeId === nodeId) {
          setSelectedNodeId(null);
        }
        updateTree(newTree);
        return newTree;
      });
    },
    [selectedNodeId, updateTree]
  );

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => prevIndex - 1);
      setSvgTree(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setSvgTree(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Move handler - for now, just log to console
  const handleMove = useCallback(() => {
    console.log("Move functionality to be implemented");
    // This would typically involve setting up a mode where nodes can be dragged
  }, []);

  // Helper variables for edit modes
  const isMoveMode = editMode === "move";
  const isScaleMode = editMode === "scale";
  const isRotateMode = editMode === "rotate";

  const selectedNode = selectedNodeId
    ? findNode(svgTree, selectedNodeId)
    : null;

  // Define node types for SVG
  const svgNodeTypes = [
    { label: 'Rectangle', type: 'rect' },
    { label: 'Circle', type: 'circle' },
    { label: 'Path', type: 'path' },
    { label: 'Text', type: 'text' },
    { label: 'Group', type: 'g' }
  ];

  // Function to create new SVG nodes
  const createSVGNode = (parentId: string, nodeType: string): XMLNode => {
    // Default attributes based on node type
    let defaultAttributes: Record<string, string> = {};
    switch (nodeType) {
      case "rect":
        defaultAttributes = {
          x: "50",
          y: "50",
          width: "100",
          height: "100",
          fill: "blue",
          stroke: "black",
          "stroke-width": "2",
        };
        break;
      case "circle":
        defaultAttributes = {
          cx: "100",
          cy: "100",
          r: "50",
          fill: "red",
          stroke: "black",
          "stroke-width": "2",
        };
        break;
      case "path":
        defaultAttributes = {
          d: "M50 50 L150 150",
          stroke: "green",
          "stroke-width": "3",
          fill: "none",
        };
        break;
      case "text":
        defaultAttributes = {
          x: "50",
          y: "50",
          fill: "black",
          "font-size": "16",
        };
        break;
      case "g":
        defaultAttributes = {
          transform: "translate(0,0)",
        };
        break;
      default:
        defaultAttributes = {};
    }

    return {
      id: `${nodeType}-${Date.now()}`,
      type: nodeType,
      attributes: defaultAttributes,
      children: [],
    };
  };

  // Render preview for SVG
  const renderSVGPreview = (node: XMLNode, isSelected: boolean, eventHandlers: any) => {
    const { type, attributes, children, textContent } = node;
    const style = isSelected ? { outline: '2px dashed blue' } : {};
    
    // Convert children to React elements
    const childElements = children.map(child => 
      renderSVGPreview(child, selectedNodeId === child.id, {})
    );
    
    // Handle text content for text elements
    if (type === 'text' || type === 'tspan') {
      return React.createElement(
        type,
        {
          key: node.id,
          ...attributes,
          ...eventHandlers,
          style
        },
        textContent,
        ...childElements
      );
    }
    
    // For other SVG elements
    // Note: React.createElement expects the type to be a string for HTML/SVG elements
    // Make sure the type is always lowercase
    const elementType = type.toLowerCase();
    return React.createElement(
      elementType,
      {
        key: node.id,
        ...attributes,
        ...eventHandlers,
        style
      },
      childElements
    );
  };

  // Attribute editor for SVG
  const renderSVGAttributeEditor = (node: XMLNode, onUpdateAttributes: (attrs: Record<string, string>) => void, onUpdateTextContent: (text: string) => void) => {
    // Use SVGElementForm for supported types, fallback to SVGAttributesEditor
    if (["circle", "rect", "g"].includes(node.type)) {
      return (
        <SVGElementForm
          elementType={node.type as "circle" | "rect" | "g"}
          attributes={node.attributes}
          onChange={onUpdateAttributes}
        />
      );
    } else {
      return (
        <SVGAttributesEditor
          node={node}
          onUpdateAttributes={onUpdateAttributes}
          onUpdateTextContent={onUpdateTextContent}
        />
      );
    }
  };


  // Custom SVG preview that uses the original SVGPreview component
  const SvgCustomPreview: React.FC = () => {
    // Convert XMLNode to SVGNode
    const svgTree: SVGNode = {
      id: xmlTree.id,
      type: xmlTree.type,
      attributes: xmlTree.attributes,
      children: xmlTree.children as SVGNode[]
    };

    return (
      <SVGPreview
        svgTree={svgTree}
        editMode={editMode}
        showGrid={showGrid}
        selectedNodeId={selectedNodeId}
        onNodeInteraction={(nodeId, updates) => {
          // Update node attributes based on interaction
          updateNodeAttributes(nodeId, updates);
        }}
        hiddenNodes={hiddenNodes}
      />
    );
  };

  // Modify renderSVGPreview to use our custom preview
  const renderSVGPreviewWithControls = (node: XMLNode, isSelected: boolean, eventHandlers: any) => {
    // For the generic preview, we'll still use the basic rendering
    // The SVG-specific interactions are handled by SVGPreview component
    return renderSVGPreview(node, isSelected, eventHandlers);
  };

  // For the SVG editor, we'll need to create a custom implementation
  // that properly integrates the SVGPreview component
  // Let's use the GenericXMLEditorPage but override the preview when in SVG mode
  return (
    <GenericXMLEditorPage
      initialTree={initialTree}
      renderPreview={renderSVGPreviewWithControls}
      attributeEditor={renderSVGAttributeEditor}
      nodeTypes={svgNodeTypes}
      onAddNode={createSVGNode}
    />
  );
};
