/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import { XMLNode, GenericXMLEditorPage } from "./GenericXMLEditorPage";

export interface GraphMLNode {
  id: string;
  type: string;
  attributes: Record<string, string>;
  children: GraphMLNode[];
  textContent?: string;
}

export const GrafeoPage = () => {
  const initialTree: XMLNode = {
    id: "root",
    type: "graphml",
    attributes: {
      xmlns: "http://graphml.graphdrawing.org/xmlns"
    },
    children: [
      {
        id: "graph-1",
        type: "graph",
        attributes: {
          id: "G",
          edgedefault: "undirected"
        },
        children: [
          // Sample nodes
          {
            id: "node-1",
            type: "node",
            attributes: { id: "n1" },
            children: [
              {
                id: "data-1",
                type: "data",
                attributes: { key: "d0" },
                children: [],
                textContent: "Node 1"
              }
            ]
          },
          {
            id: "node-2",
            type: "node",
            attributes: { id: "n2" },
            children: [
              {
                id: "data-2",
                type: "data",
                attributes: { key: "d0" },
                children: [],
                textContent: "Node 2"
              }
            ]
          },
          {
            id: "node-3",
            type: "node",
            attributes: { id: "n3" },
            children: [
              {
                id: "data-3",
                type: "data",
                attributes: { key: "d0" },
                children: [],
                textContent: "Node 3"
              }
            ]
          },
          // Sample edges
          {
            id: "edge-1",
            type: "edge",
            attributes: { source: "n1", target: "n2" },
            children: [
              {
                id: "data-4",
                type: "data",
                attributes: { key: "d1" },
                children: [],
                textContent: "Edge from 1 to 2"
              }
            ]
          },
          {
            id: "edge-2",
            type: "edge",
            attributes: { source: "n2", target: "n3" },
            children: [
              {
                id: "data-5",
                type: "data",
                attributes: { key: "d1" },
                children: [],
                textContent: "Edge from 2 to 3"
              }
            ]
          },
          {
            id: "edge-3",
            type: "edge",
            attributes: { source: "n3", target: "n1" },
            children: [
              {
                id: "data-6",
                type: "data",
                attributes: { key: "d1" },
                children: [],
                textContent: "Edge from 3 to 1"
              }
            ]
          }
        ]
      }
    ],
  };

  const [graphmlTree, setGraphmlTree] = useState<XMLNode>(initialTree);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [history, setHistory] = useState<GraphMLNode[]>([initialTree]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [hiddenNodes, setHiddenNodes] = useState<Set<string>>(new Set());

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
      setGraphmlTree(newTree);
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
      setGraphmlTree((prevTree) => {
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
      setGraphmlTree((prevTree) => {
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
  const addChildNode = useCallback(
    (parentId: string, nodeType: string) => {
      setGraphmlTree((prevTree) => {
        const newTree = JSON.parse(JSON.stringify(prevTree));
        const parent = findNode(newTree, parentId);
        if (parent) {
          // Default attributes based on node type
          let defaultAttributes: Record<string, string> = {};
          switch (nodeType) {
            case "node":
              defaultAttributes = { id: `n${Date.now()}` };
              break;
            case "edge":
              defaultAttributes = { source: "", target: "" };
              break;
            case "data":
              defaultAttributes = { key: "" };
              break;
            case "key":
              defaultAttributes = { id: "", for: "node", "attr.name": "", "attr.type": "string" };
              break;
            default:
              defaultAttributes = {};
          }

          const newNode: XMLNode = {
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
      setGraphmlTree((prevTree) => {
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

  const selectedNode = selectedNodeId
    ? findNode(graphmlTree, selectedNodeId)
    : null;

  // Define node types for GraphML
  const graphmlNodeTypes = [
    { label: 'Node', type: 'node' },
    { label: 'Edge', type: 'edge' },
    { label: 'Key', type: 'key' },
    { label: 'Data', type: 'data' }
  ];

  // Function to create new GraphML nodes
  const createGraphMLNode = (parentId: string, nodeType: string): XMLNode => {
    // Default attributes based on node type
    let defaultAttributes: Record<string, string> = {};
    switch (nodeType) {
      case "node":
        defaultAttributes = { id: `n${Date.now()}` };
        break;
      case "edge":
        defaultAttributes = { source: "", target: "" };
        break;
      case "data":
        defaultAttributes = { key: "" };
        break;
      case "key":
        defaultAttributes = { id: "", for: "node", "attr.name": "", "attr.type": "string" };
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

  // Render preview for GraphML
  const renderGraphMLPreview = (node: XMLNode, isSelected: boolean, eventHandlers: any) => {
    const { type, attributes, children, textContent } = node;
    const style = isSelected ? { outline: '2px dashed blue' } : {};
    
    // Convert children to React elements
    const childElements = children.map(child => 
      renderGraphMLPreview(child, selectedNodeId === child.id, {})
    );
    
    // Handle different GraphML element types
    switch (type) {
      case 'node':
        return (
          <div 
            key={node.id}
            className="border rounded p-2 m-1 d-inline-block"
            style={{ ...style, background: '#f0f8ff' }}
            {...eventHandlers}
          >
            Node: {attributes.id}
            {childElements}
          </div>
        );
      case 'edge':
        return (
          <div 
            key={node.id}
            className="border-top pt-1 m-1"
            style={style}
            {...eventHandlers}
          >
            Edge: {attributes.source} → {attributes.target}
            {childElements}
          </div>
        );
      case 'key':
        return (
          <div 
            key={node.id}
            className="border rounded p-1 m-1 small"
            style={{ ...style, background: '#fff0f0' }}
            {...eventHandlers}
          >
            Key: {attributes.id} ({attributes.for})
            {childElements}
          </div>
        );
      case 'data':
        return (
          <div 
            key={node.id}
            className="border rounded p-1 m-1 small"
            style={{ ...style, background: '#f0fff0' }}
            {...eventHandlers}
          >
            Data: {attributes.key} = {textContent}
            {childElements}
          </div>
        );
      case 'graph':
        return (
          <div 
            key={node.id}
            className="border rounded p-3 m-2"
            style={{ ...style, background: '#f8f9fa' }}
            {...eventHandlers}
          >
            Graph: {attributes.id}
            {childElements}
          </div>
        );
      case 'graphml':
        return (
          <div 
            key={node.id}
            className="p-3"
            style={style}
            {...eventHandlers}
          >
            {childElements}
          </div>
        );
      default:
        return (
          <div key={node.id} style={style} {...eventHandlers}>
            {type} element
            {childElements}
            {textContent}
          </div>
        );
    }
  };

  // Attribute editor for GraphML
  const renderGraphMLAttributeEditor = (node: XMLNode, onUpdateAttributes: (attrs: Record<string, string>) => void, onUpdateTextContent: (text: string) => void) => {
    const handleAttributeChange = (key: string, value: string) => {
      const newAttributes = { ...node.attributes, [key]: value };
      onUpdateAttributes(newAttributes);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateTextContent(e.target.value);
    };

    return (
      <div>
        {/* Text content editor for data elements */}
        {node.type === 'data' && (
          <div className="mb-3">
            <label className="form-label">Value</label>
            <input
              type="text"
              className="form-control"
              value={node.textContent || ''}
              onChange={handleTextChange}
            />
          </div>
        )}
        
        {/* Attribute editors */}
        {Object.entries(node.attributes).map(([key, value]) => (
          <div key={key} className="mb-2">
            <label className="form-label">{key}</label>
            <input
              type="text"
              className="form-control"
              value={value}
              onChange={(e) => handleAttributeChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    );
  };

  // Custom preview component for GraphML that renders a proper graph visualization
  const GraphMLPreview: React.FC<{ xmlTree: XMLNode }> = ({ xmlTree }) => {
    // Find the graph node
    const findGraph = (node: XMLNode): XMLNode | null => {
      if (node.type === 'graph') return node;
      for (const child of node.children) {
        const found = findGraph(child);
        if (found) return found;
      }
      return null;
    };

    const graph = findGraph(xmlTree);
    
    if (!graph) {
      return <div>No graph found</div>;
    }

    // Extract nodes and edges
    const nodes = graph.children.filter(child => child.type === 'node');
    const edges = graph.children.filter(child => child.type === 'edge');
    
    // Simple layout - arrange nodes in a circle
    const radius = 150;
    const centerX = 200;
    const centerY = 200;
    
    return (
      <div className="border rounded p-3 d-flex justify-content-center align-items-center" 
           style={{ height: '400px', background: '#f8f9fa' }}>
        <svg width="400" height="400" style={{ background: 'white' }}>
          {/* Render edges first (behind nodes) */}
          {edges.map(edge => {
            const sourceId = edge.attributes.source;
            const targetId = edge.attributes.target;
            
            const sourceNode = nodes.find(n => n.attributes.id === sourceId);
            const targetNode = nodes.find(n => n.attributes.id === targetId);
            
            if (!sourceNode || !targetNode) return null;
            
            // Calculate positions in a circle
            const sourceIndex = nodes.findIndex(n => n.attributes.id === sourceId);
            const targetIndex = nodes.findIndex(n => n.attributes.id === targetId);
            
            const sourceAngle = (2 * Math.PI * sourceIndex) / nodes.length;
            const targetAngle = (2 * Math.PI * targetIndex) / nodes.length;
            
            const sourceX = centerX + radius * Math.cos(sourceAngle);
            const sourceY = centerY + radius * Math.sin(sourceAngle);
            const targetX = centerX + radius * Math.cos(targetAngle);
            const targetY = centerY + radius * Math.sin(targetAngle);
            
            return (
              <line
                key={edge.id}
                x1={sourceX}
                y1={sourceY}
                x2={targetX}
                y2={targetY}
                stroke="#666"
                strokeWidth="2"
              />
            );
          })}
          
          {/* Render nodes */}
          {nodes.map((node, index) => {
            const angle = (2 * Math.PI * index) / nodes.length;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const isSelected = selectedNodeId === node.id;
            
            return (
              <g key={node.id}>
                <circle
                  cx={x}
                  cy={y}
                  r="20"
                  fill={isSelected ? '#007bff' : '#6c757d'}
                  stroke={isSelected ? '#0056b3' : '#495057'}
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedNodeId(node.id)}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dy=".3em"
                  fill="white"
                  fontSize="12"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.attributes.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Always use the custom graph visualization for the preview
  const renderGraphMLPreviewWithGraph = (node: XMLNode, isSelected: boolean, eventHandlers: any) => {
    // Always render the full graph visualization
    return <GraphMLPreview xmlTree={graphmlTree} />;
  };

  return (
    <GenericXMLEditorPage
      initialTree={initialTree}
      renderPreview={renderGraphMLPreviewWithGraph}
      attributeEditor={renderGraphMLAttributeEditor}
      nodeTypes={graphmlNodeTypes}
      onAddNode={createGraphMLNode}
    />
  );
};
