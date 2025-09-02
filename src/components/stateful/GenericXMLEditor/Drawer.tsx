import React, { useState, useRef, useEffect } from 'react';
import { Card } from 'react-bootstrap';

interface DrawerProps {
  position: 'left' | 'right' | 'bottom';
  isOpen: boolean;
  zIndex: number;
  onToggle: () => void;
  onBringToFront: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  position,
  isOpen,
  zIndex,
  onBringToFront,
  title,
  children
}) => {
  const [size, setSize] = useState(position === 'bottom' ? 200 : 300);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, size: 0 });
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      size: size
    });
    onBringToFront();
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      switch (position) {
        case 'left':
          setSize(Math.max(40, Math.min(window.innerWidth - 100, dragStart.size + (e.clientX - dragStart.x))));
          break;
        case 'right':
          setSize(Math.max(40, Math.min(window.innerWidth - 100, dragStart.size - (e.clientX - dragStart.x))));
          break;
        case 'bottom':
          setSize(Math.max(40, Math.min(window.innerHeight - 100, dragStart.size - (e.clientY - dragStart.y))));
          break;
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = position === 'bottom' ? 'ns-resize' : 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, dragStart, position]);

  const getPositionStyles = () => {
    switch (position) {
      case 'left':
        return {
          top: 0,
          left: 0,
          height: '100%',
          width: `${size}px`,
          transform: 'none'
        };
      case 'right':
        return {
          top: 0,
          right: 0,
          height: '100%',
          width: `${size}px`,
          transform: 'none'
        };
      case 'bottom':
        return {
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${size}px`,
          transform: 'none'
        };
      default:
        return {};
    }
  };

  // Determine which edge to show the drag handle based on position
  const getDragEdgeStyle = () => {
    switch (position) {
      case 'left':
        return {
          right: '0',
          top: '0',
          height: '100%',
          width: '8px',
          cursor: 'ew-resize'
        };
      case 'right':
        return {
          left: '0',
          top: '0',
          height: '100%',
          width: '8px',
          cursor: 'ew-resize'
        };
      case 'bottom':
        return {
          top: '0',
          left: '0',
          width: '100%',
          height: '8px',
          cursor: 'ns-resize'
        };
      default:
        return {};
    }
  };

  return (
    <div
      ref={drawerRef}
      className={`position-absolute bg-light border ${isResizing ? 'user-select-none' : ''}`}
      style={{
        ...getPositionStyles(),
        zIndex,
        transition: isResizing ? 'none' : 'all 0.3s ease',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center p-2 border-bottom bg-white"
        onMouseDown={() => onBringToFront()}
        style={{ cursor: 'move' }}
      >
        <span>{title}</span>
      </div>
      
      {/* Content - Always render but control visibility with height/width */}
      <div className="h-100" style={{ overflow: 'auto' }}>
        {children}
      </div>
      
      {/* Resize handle */}
      <div
        style={{
          position: 'absolute',
          ...getDragEdgeStyle(),
          backgroundColor: 'rgba(0, 0, 0, 0.2)'
        }}
        onMouseDown={handleMouseDown}
        className="drag-edge"
      />
    </div>
  );
};
