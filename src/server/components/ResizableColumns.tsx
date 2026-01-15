import React, { useState, useEffect, useCallback } from 'react';

interface ResizableColumnsProps {
  children: React.ReactNode[];
  initialWidths?: number[];
  minWidth?: number;
}

export const ResizableColumns: React.FC<ResizableColumnsProps> = ({
  children,
  initialWidths = [25, 25, 25, 25],
  minWidth = 10
}) => {
  const [widths, setWidths] = useState<number[]>(initialWidths);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidths, setStartWidths] = useState<number[]>([]);

  const handleMouseDown = useCallback((index: number, e: React.MouseEvent) => {
    setIsDragging(index);
    setStartX(e.clientX);
    setStartWidths([...widths]);
    e.preventDefault();
  }, [widths]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging === null) return;

    const deltaX = e.clientX - startX;
    const container = document.getElementById('resizable-container');
    if (!container) return;

    const totalWidth = container.clientWidth;
    const deltaPercent = (deltaX / totalWidth) * 100;

    const newWidths = [...startWidths];
    
    // Adjust the two columns adjacent to the divider
    const leftIndex = isDragging;
    const rightIndex = isDragging + 1;
    
    // Calculate new widths ensuring they don't go below minWidth
    const newLeftWidth = Math.max(minWidth, startWidths[leftIndex] + deltaPercent);
    const newRightWidth = Math.max(minWidth, startWidths[rightIndex] - deltaPercent);
    
    // If either would be below minWidth, adjust both proportionally
    if (newLeftWidth < minWidth || newRightWidth < minWidth) {
      return;
    }
    
    newWidths[leftIndex] = newLeftWidth;
    newWidths[rightIndex] = newRightWidth;
    
    // Normalize to ensure total is 100%
    const total = newWidths.reduce((sum, width) => sum + width, 0);
    const normalizedWidths = newWidths.map(width => (width / total) * 100);
    
    setWidths(normalizedWidths);
  }, [isDragging, startX, startWidths, minWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      id="resizable-container"
      className="d-flex h-100 w-100 position-relative"
      style={{ 
        userSelect: isDragging !== null ? 'none' : 'auto',
        cursor: isDragging !== null ? 'col-resize' : 'default'
      }}
    >
      {children.map((child, index) => (
        <React.Fragment key={index}>
          <div 
            className="h-100 overflow-auto"
            style={{ 
              width: `${widths[index]}%`,
              minWidth: `${minWidth}%`,
              flexShrink: 0
            }}
          >
            {child}
          </div>
          {index < children.length - 1 && (
            <div
              className="position-relative h-100"
              style={{ 
                width: '4px',
                flexShrink: 0,
                cursor: 'col-resize',
                backgroundColor: isDragging === index ? '#007bff' : '#e9ecef'
              }}
              onMouseDown={(e) => handleMouseDown(index, e)}
            >
              <div 
                className="position-absolute top-0 bottom-0 start-50 translate-middle-x"
                style={{ 
                  width: '1px',
                  backgroundColor: '#6c757d'
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
