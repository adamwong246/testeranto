import React, { useState, useCallback } from "react";
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
  renderPreview: (node: XMLNode, isSelected: boolean, eventHandlers: any) => React.ReactElement;
  attributeEditor: (node: XMLNode, onUpdateAttributes: (attrs: Record<string, string>) => void, onUpdateTextContent: (text: string) => void) => React.ReactElement;
  nodeTypes: { label: string; type: string }[];
  onAddNode: (parentId: string, nodeType: string) => XMLNode;
  additionalControls?: React.ReactNode;
}

export const GenericXMLEditorPage: React.FC<GenericXMLEditorPageProps> = ({
  initialTree,
  renderPreview,
  attributeEditor,
  nodeTypes,
  onAddNode
}) => {
  const [xmlTree, setXmlTree] = useState<XMLNode>(initialTree);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [history, setHistory] = useState<XMLNode[]>([initialTree]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());
  const [drawerStates, setDrawerStates] = useState({
    left: { isOpen: true, zIndex: 1 },
    right: { isOpen: true, zIndex: 1 },
    bottom: { isOpen: true, zIndex: 1 }
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
  const bringToFront = useCallback((drawer: string) => {
    const maxZIndex = Math.max(
      drawerStates.left.zIndex,
      drawerStates.right.zIndex,
      drawerStates.bottom.zIndex
    );
    
    setDrawerStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(key => {
        if (key === drawer) {
          newStates[key as keyof typeof newStates].zIndex = maxZIndex + 1;
        } else {
          newStates[key as keyof typeof newStates].zIndex = Math.max(1, newStates[key as keyof typeof newStates].zIndex - 1);
        }
      });
      return newStates;
    });
    setActiveDrawer(drawer);
  }, [drawerStates]);

  const selectedNode = selectedNodeId
    ? findNode(xmlTree, selectedNodeId)
    : null;

  return (
    <div className="d-flex flex-column h-100">
      {/* Control Bar */}
      <div className="border-bottom p-2 bg-light">
        <div className="d-flex justify-content-center align-items-center">
          <ButtonGroup size="sm" className="me-2">
            <Button
              variant={activeTab === "preview" ? "primary" : "outline-secondary"}
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
          
          <ButtonGroup size="sm">
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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="position-relative flex-grow-1">
        {activeTab === "preview" ? (
          <>
            {/* Preview Content */}
            <div className="position-absolute w-100 h-100 p-3">
              <GenericPreview
                xmlTree={xmlTree}
                selectedNodeId={selectedNodeId}
                hiddenNodes={hiddenNodes}
                renderPreview={renderPreview}
              />
            </div>
            
            {/* Drawers - Only visible in preview mode */}
            <Drawer
              position="left"
              isOpen={true}
              zIndex={drawerStates.left.zIndex}
              onBringToFront={() => bringToFront('left')}
              title="Tree View"
            >
              <ul style={{ paddingLeft: '0', marginBottom: '0' }}>
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
              onBringToFront={() => bringToFront('right')}
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
              onBringToFront={() => bringToFront('bottom')}
              title="Navigation Help"
            >
              <div className="p-3">
                <h4>Pan & Zoom Controls</h4>
                <p>
                  <strong>Zoom:</strong> Use mouse wheel or +/- buttons
                </p>
                <p>
                  <strong>Pan:</strong> Middle mouse button or Alt + Left click and drag
                </p>
                <p>
                  <strong>Reset:</strong> Click the Reset button to return to default view
                </p>
                <p className="text-muted">
                  Note: These controls work across all editors (SVG, Bootstrap, GraphML)
                </p>
              </div>
            </Drawer>
          </>
        ) : (
          /* Text Mode - Full screen text editor, no drawers */
          <div className="w-100 h-100 d-flex justify-content-center p-3">
            <GenericTextEditor
              xmlTree={xmlTree}
              onUpdateTree={setXmlTree}
            />
          </div>
        )}
      </div>
    </div>
  );
};
