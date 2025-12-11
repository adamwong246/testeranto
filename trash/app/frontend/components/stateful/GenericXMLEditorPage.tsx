/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback, useEffect } from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import { GenericTree } from "./GenericXMLEditor/GenericTree";
import { GenericPreview } from "./GenericXMLEditor/GenericPreview";
import { GenericTextEditor } from "./GenericXMLEditor/GenericTextEditor";
import { Drawer } from "./GenericXMLEditor/Drawer";

export interface XMLNode {
  id: string;
  type: string;
  attributes: Record<string, string>;
  children: XMLNode[];
  textContent?: string;
}

interface GenericXMLEditorPageProps {
  initialTree: XMLNode;
  renderPreview: (
    node: XMLNode,
    isSelected: boolean,
    eventHandlers: any,
    onTreeUpdate?: (newTree: XMLNode) => void
  ) => React.ReactElement;
  attributeEditor: (
    node: XMLNode,
    onUpdateAttributes: (attrs: Record<string, string>) => void,
    onUpdateTextContent: (text: string) => void
  ) => React.ReactElement;
  nodeTypes: { label: string; type: string }[];
  onAddNode: (parentId: string, nodeType: string) => XMLNode;
  additionalControls?: React.ReactNode;
}

export const GenericXMLEditorPage: React.FC<GenericXMLEditorPageProps> = ({
  initialTree,
  renderPreview,
  attributeEditor,
  nodeTypes,
  onAddNode,
}) => {
  const [xmlTree, setXmlTree] = useState<XMLNode>(initialTree);
  // Add a check to ensure xmlTree is never undefined
  useEffect(() => {
    if (!xmlTree) {
      console.error("xmlTree became undefined, resetting to initialTree");
      setXmlTree(initialTree);
    }
  }, [xmlTree, initialTree]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [history, setHistory] = useState<XMLNode[]>([initialTree]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
  const [drawerStates, setDrawerStates] = useState({
    left: { isOpen: true, zIndex: 1 },
    right: { isOpen: true, zIndex: 1 },
    bottom: { isOpen: true, zIndex: 1 },
  });
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // Find a node by ID
  const findNode = useCallback((node: XMLNode, id: string): XMLNode | null => {
    if (node.id === id) return node;
    for (const child of node.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  }, []);

  // Helper to update tree and manage history
  const updateTree = useCallback(
    (newTree: XMLNode) => {
      setXmlTree(newTree);
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
      setXmlTree((prevTree) => {
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
      setXmlTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const node = findNode(newTree, nodeId);
        if (node) {
          node.textContent = textContent;
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

  // Add a new child node
  const handleAddChildNode = useCallback(
    (parentId: string, nodeType: string) => {
      setXmlTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const parent = findNode(newTree, parentId);
        if (parent) {
          const newNode = onAddNode(parentId, nodeType);
          parent.children = [...parent.children, newNode];
          setSelectedNodeId(newNode.id);
          updateTree(newTree);
        }
        return newTree;
      });
    },
    [findNode, updateTree, onAddNode]
  );

  // Remove a node
  const removeNode = useCallback(
    (nodeId: string) => {
      setXmlTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const removeFromParent = (node: XMLNode, targetId: string): boolean => {
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
      setXmlTree(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => prevIndex + 1);
      setXmlTree(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Drawers are always open now, but we can keep the state for other purposes
  // Remove toggle functionality since we're always showing content

  // Bring drawer to front
  const bringToFront = useCallback(
    (drawer: string) => {
      const maxZIndex = Math.max(
        drawerStates.left.zIndex,
        drawerStates.right.zIndex,
        drawerStates.bottom.zIndex
      );

      setDrawerStates((prev) => {
        const newStates = { ...prev };
        Object.keys(newStates).forEach((key) => {
          if (key === drawer) {
            newStates[key as keyof typeof newStates].zIndex = maxZIndex + 1;
          } else {
            newStates[key as keyof typeof newStates].zIndex = Math.max(
              1,
              newStates[key as keyof typeof newStates].zIndex - 1
            );
          }
        });
        return newStates;
      });
      setActiveDrawer(drawer);
    },
    [drawerStates]
  );

  const selectedNode = selectedNodeId
    ? findNode(xmlTree, selectedNodeId)
    : null;

  // Function to convert XML tree to XML string with proper formatting
  const convertTreeToXML = useCallback((node: XMLNode, depth: number = 0): string => {
    const indent = '  '.repeat(depth);
    const attributes = Object.entries(node.attributes)
      .map(([key, value]) => ` ${key}="${value}"`)
      .join('');
    
    // Handle text content
    const hasTextContent = node.textContent && node.textContent.trim().length > 0;
    
    if (node.children.length === 0) {
      if (hasTextContent) {
        return `${indent}<${node.type}${attributes}>${node.textContent}</${node.type}>\n`;
      } else {
        return `${indent}<${node.type}${attributes} />\n`;
      }
    } else {
      let result = `${indent}<${node.type}${attributes}`;
      
      // If there are children and text content, we need to be careful
      if (hasTextContent) {
        result += `>${node.textContent}\n`;
      } else {
        result += '>\n';
      }
      
      // Add children
      node.children.forEach(child => {
        result += convertTreeToXML(child, depth + 1);
      });
      
      result += `${indent}</${node.type}>\n`;
      return result;
    }
  }, []);

  // Function to handle saving the XML
  const handleSave = useCallback(async () => {
    // Convert the XML tree to a proper XML string
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n${convertTreeToXML(xmlTree)}`;
    
    // Debug: log the content being sent
    console.log('Saving XML content:', xmlContent);
    
    // Let's also check if the content looks right
    if (!xmlContent.includes('kanban:KanbanProcess')) {
      console.warn('XML content may not be properly formatted');
    }
    
    try {
      const response = await fetch('/api/files/write', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: 'example/single-kanban-process.xml',
          content: xmlContent
        })
      });
      
      if (response.ok) {
        alert('File saved successfully!');
        // Refresh the page to see changes
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        alert(`Error saving file: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving file:', error);
      alert('Failed to save file');
    }
  }, [xmlTree, convertTreeToXML]);

  return (
    <div className="d-flex flex-column h-100">
      {/* Control Bar */}
      <div className="border-bottom p-0 bg-light">
        <div className="d-flex justify-content-center align-items-center">
          <ButtonGroup size="sm" className="me-2">
            <Button
              variant={
                activeTab === "preview" ? "primary" : "outline-secondary"
              }
              onClick={() => setActiveTab("preview")}
            >
              Preview
            </Button>
            <Button
              variant={activeTab === "text" ? "primary" : "outline-secondary"}
              onClick={() => setActiveTab("text")}
            >
              Text Mode
            </Button>
          </ButtonGroup>

          <ButtonGroup size="sm" className="me-2">
            <Button
              variant="outline-secondary"
              onClick={handleUndo}
              disabled={historyIndex === 0}
            >
              Undo
            </Button>
            <Button
              variant="outline-secondary"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
            >
              Redo
            </Button>
          </ButtonGroup>
          
          <ButtonGroup size="sm">
            <Button
              variant="outline-success"
              onClick={handleSave}
            >
              Save
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="position-relative flex-grow-1">
        {activeTab === "preview" ? (
          <>
            {/* Preview Content */}
            <div className="position-absolute w-100 h-100 p-0">
              {xmlTree && (
                <GenericPreview
                  xmlTree={xmlTree}
                  selectedNodeId={selectedNodeId}
                  hiddenNodes={hiddenNodes}
                  renderPreview={(node, isSelected, eventHandlers) =>
                    renderPreview(node, isSelected, eventHandlers, updateTree)
                  }
                />
              )}
            </div>

            {/* Drawers - Only visible in preview mode */}
            <Drawer
              position="left"
              isOpen={true}
              zIndex={drawerStates.left.zIndex}
              onBringToFront={() => bringToFront("left")}
              title="Tree View"
            >
              <ul style={{ paddingLeft: "0", marginBottom: "0" }}>
                <GenericTree
                  node={xmlTree}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                  onAddNode={handleAddChildNode}
                  onRemoveNode={removeNode}
                  onToggleVisibility={toggleNodeVisibility}
                  hiddenNodes={hiddenNodes}
                  nodeTypes={nodeTypes}
                />
              </ul>
            </Drawer>

            <Drawer
              position="right"
              isOpen={true}
              zIndex={drawerStates.right.zIndex}
              onBringToFront={() => bringToFront("right")}
              title="Attributes"
            >
              {selectedNode ? (
                <Card className="mb-3">
                  <Card.Header>
                    <strong>Node: {selectedNode.type}</strong>
                  </Card.Header>
                  <Card.Body>
                    {attributeEditor(
                      selectedNode,
                      (attrs) => updateNodeAttributes(selectedNode.id, attrs),
                      (text) => updateNodeTextContent(selectedNode.id, text)
                    )}
                  </Card.Body>
                </Card>
              ) : (
                <Card>
                  <Card.Body>
                    <p className="text-muted">
                      Select a node to edit its properties
                    </p>
                  </Card.Body>
                </Card>
              )}
            </Drawer>

            <Drawer
              position="bottom"
              isOpen={true}
              zIndex={drawerStates.bottom.zIndex}
              onBringToFront={() => bringToFront("bottom")}
              title="Navigation Help"
            >
              <div className="p-1">
                <h6 className="mb-0 small">Pan & Zoom</h6>
                <p className="mb-0 small">
                  <strong>Zoom:</strong> Wheel
                </p>
                <p className="mb-0 small">
                  <strong>Pan:</strong> Alt+drag
                </p>
                <p className="mb-0 small">
                  <strong>Reset:</strong> Button
                </p>
              </div>
            </Drawer>
          </>
        ) : (
          /* Text Mode - Full screen text editor, no drawers */
          <div className="w-100 h-100 d-flex justify-content-center p-0">
            <GenericTextEditor xmlTree={xmlTree} onUpdateTree={setXmlTree} />
          </div>
        )}
      </div>
    </div>
  );
};
