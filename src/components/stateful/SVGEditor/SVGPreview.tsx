import React, { useState, useRef, useCallback } from 'react';
import { SVGNode } from '../SVGEditorPage';

interface SVGPreviewProps {
  svgTree: SVGNode;
  editMode: string;
  showGrid: boolean;
  selectedNodeId: string | null;
  onNodeInteraction: (nodeId: string, updates: Record<string, string>) => void;
  hiddenNodes: Set<string>;
}

const renderGrid = (width: number, height: number) => {
  const gridSize = 20;
  const lines = [];
  
  // Horizontal lines
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#e0e0e0"
        strokeWidth={1}
      />
    );
  }
  
  // Vertical lines
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke="#e0e0e0"
        strokeWidth={1}
      />
    );
  }
  
  return lines;
};

export const SVGPreview: React.FC<SVGPreviewProps> = ({ 
  svgTree, 
  editMode, 
  showGrid, 
  selectedNodeId,
  onNodeInteraction,
  hiddenNodes 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [originalAttributes, setOriginalAttributes] = useState<Record<string, string>>({});

  const getSVGPoint = useCallback((clientX: number, clientY: number) => {
    if (svgRef.current) {
      const pt = svgRef.current.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      return pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    }
    return { x: 0, y: 0 };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, node: SVGNode) => {
    if (editMode !== 'none' && selectedNodeId === node.id) {
      e.preventDefault();
      setIsInteracting(true);
      setStartPoint({ x: e.clientX, y: e.clientY });
      setOriginalAttributes({ ...node.attributes });
    }
  }, [editMode, selectedNodeId]);

  const handleMouseMove = useCallback((e: React.MouseEvent, node: SVGNode) => {
    if (isInteracting && editMode !== 'none' && selectedNodeId === node.id) {
      e.preventDefault();
      const currentPoint = getSVGPoint(e.clientX, e.clientY);
      const startSVGPoint = getSVGPoint(startPoint.x, startPoint.y);
      
      const dx = currentPoint.x - startSVGPoint.x;
      const dy = currentPoint.y - startSVGPoint.y;
      
      const updates: Record<string, string> = {};
      
      switch (editMode) {
        case 'move':
          if (node.type === 'rect' || node.type === 'text') {
            updates.x = (parseFloat(originalAttributes.x || '0') + dx).toString();
            updates.y = (parseFloat(originalAttributes.y || '0') + dy).toString();
          } else if (node.type === 'circle') {
            updates.cx = (parseFloat(originalAttributes.cx || '0') + dx).toString();
            updates.cy = (parseFloat(originalAttributes.cy || '0') + dy).toString();
          }
          break;
        
        case 'scale':
          if (node.type === 'rect') {
            updates.width = Math.max(0, parseFloat(originalAttributes.width || '0') + dx).toString();
            updates.height = Math.max(0, parseFloat(originalAttributes.height || '0') + dy).toString();
          } else if (node.type === 'circle') {
            updates.r = Math.max(0, parseFloat(originalAttributes.r || '0') + dx).toString();
          }
          break;
        
        case 'rotate':
          // Calculate angle from center
          const centerX = parseFloat(originalAttributes.cx || originalAttributes.x || '0') + 
                         parseFloat(originalAttributes.width || '0') / 2;
          const centerY = parseFloat(originalAttributes.cy || originalAttributes.y || '0') + 
                         parseFloat(originalAttributes.height || '0') / 2;
          
          const startAngle = Math.atan2(
            startSVGPoint.y - centerY,
            startSVGPoint.x - centerX
          );
          const currentAngle = Math.atan2(
            currentPoint.y - centerY,
            currentPoint.x - centerX
          );
          
          const angleDiff = (currentAngle - startAngle) * 180 / Math.PI;
          updates.transform = `rotate(${angleDiff}, ${centerX}, ${centerY})`;
          break;
      }
      
      onNodeInteraction(node.id, updates);
    }
  }, [isInteracting, editMode, selectedNodeId, startPoint, originalAttributes, getSVGPoint, onNodeInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsInteracting(false);
  }, []);

  const renderSVGNode = useCallback((node: SVGNode): React.ReactElement | null => {
    // Skip rendering if node is hidden
    if (hiddenNodes.has(node.id)) {
      return null;
    }
    
    const isSelected = selectedNodeId === node.id;
    const { type, attributes, children } = node;
    
    const eventHandlers = editMode !== 'none' && isSelected ? {
      onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, node),
      onMouseMove: (e: React.MouseEvent) => handleMouseMove(e, node),
      style: { cursor: getCursorForMode(editMode), outline: isSelected ? '2px dashed blue' : 'none' }
    } : {
      style: { outline: isSelected ? '2px dashed blue' : 'none' }
    };
    
    // Filter out hidden children
    const visibleChildren = children
      .map(renderSVGNode)
      .filter(child => child !== null) as React.ReactElement[];
    
    // For text elements, use the text content
    if (type === 'text' || type === 'tspan') {
      const textContent = attributes['data-text-content'] || '';
      return React.createElement(
        type,
        {
          key: node.id,
          ...attributes,
          ...eventHandlers
        },
        textContent,
        ...visibleChildren
      );
    }
    
    return React.createElement(
      type,
      {
        key: node.id,
        ...attributes,
        ...eventHandlers
      },
      visibleChildren
    );
  }, [editMode, selectedNodeId, hiddenNodes, handleMouseDown, handleMouseMove]);

  const getCursorForMode = (mode: string) => {
    switch (mode) {
      case 'move': return 'move';
      case 'scale': return 'nwse-resize';
      case 'rotate': return 'crosshair';
      default: return 'pointer';
    }
  };

  const width = parseInt(svgTree.attributes.width || '400');
  const height = parseInt(svgTree.attributes.height || '400');

  return (
    <div 
      className="border rounded p-3 d-flex justify-content-center align-items-center" 
      style={{ height: '400px' }}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg 
        ref={svgRef}
        {...svgTree.attributes}
        style={{ 
          background: showGrid ? '#f8f9fa' : 'white',
          cursor: editMode !== 'none' ? getCursorForMode(editMode) : 'default'
        }}
        onMouseMove={(e) => {
          // Handle mouse move on the SVG itself if needed
        }}
      >
        {showGrid && renderGrid(width, height)}
        {svgTree.children.map(renderSVGNode)}
      </svg>
    </div>
  );
};
