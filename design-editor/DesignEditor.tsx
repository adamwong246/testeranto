/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, Rect, Circle, Text } from 'fabric';
import { toPng } from 'html-to-image';

interface DesignObject {
  type: string;
  [key: string]: any;
}

interface Design {
  version: string;
  background: string;
  objects: DesignObject[];
}

interface Collaborator {
  id: string;
  name: string;
}

export interface DesignEditorRef {
  loadDesign: (design: Design) => void;
  saveDesign: () => Design | null;
}

export const DesignEditor = React.forwardRef<DesignEditorRef, { projectId: string }>(
  ({ projectId }, ref) => {
  const canvasRef = useRef<fabric.Canvas | null>(null);
  const [design, setDesign] = useState<Design>({
    objects: [],
    background: '#ffffff',
    version: '1.0'
  });
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  // Initialize canvas and WebSocket connection
  useEffect(() => {
    const canvas = new Canvas('design-canvas', {
      width: 800,
      height: 600
    });
    canvas.backgroundColor = design.background;
    canvasRef.current = canvas;

    const wsPort = window.location.port ? Number(window.location.port) + 1 : 3001;
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    wsRef.current = new WebSocket(`${protocol}//${host}:${wsPort}/design?project=${projectId}`);

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'design_update' && canvasRef.current) {
        canvasRef.current.loadFromJSON(message.data, () => {
          canvasRef.current?.renderAll();
        });
      } else if (message.type === 'collaborators_update') {
        setCollaborators(message.data);
      }
    };

    return () => {
      wsRef.current?.close();
      canvas.dispose();
    };
  }, [projectId]);

  const addShape = (shape: string) => {
    if (!canvasRef.current) return;

    let object;
    switch (shape) {
      case 'rectangle':
        object = new Rect({
          width: 100,
          height: 100,
          fill: 'red',
          left: 100,
          top: 100
        });
        break;
      case 'circle':
        object = new Circle({
          radius: 50,
          fill: 'blue',
          left: 200,
          top: 200
        });
        break;
      case 'text':
        object = new Text('Double click to edit', {
          fontFamily: 'Arial',
          fontSize: 20,
          left: 100,
          top: 300
        });
        break;
      default:
        return;
    }

    canvasRef.current.add(object);
    canvasRef.current.renderAll();
  };

  const saveDesign = (): Design | null => {
    if (!canvasRef.current) {
      console.warn('Canvas ref is null, cannot save design');
      return null;
    }
    
    try {
      // Get current canvas state
      const json = canvasRef.current.toJSON() as Design;
      setDesign(json);
      
      // Send update to collaborators
      if (wsRef.current) {
        wsRef.current.send(JSON.stringify({
          type: 'design_update',
          data: json
        }));
      }
      
      // Force re-render of all objects
      canvasRef.current.getObjects().forEach(obj => {
        obj.set('dirty', true);
      });
      canvasRef.current.renderAll();
      
      console.log('Design saved:', json);
      return json;
    } catch (err) {
      console.error('Error saving design:', err);
      return null;
    }
  };

  const loadDesign = (design: Design) => {
    console.log('loadDesign called with:', design);
    if (!canvasRef.current) {
      console.warn('Canvas ref is null, cannot load design');
      return;
    }

    try {
      console.log('Loading design into canvas...');

      // Clear existing canvas
      canvasRef.current.clear();

      // Set background color
      if (design.background) {
        canvasRef.current.backgroundColor = design.background;
      }

      // Load objects if they exist
      if (design.objects && design.objects.length > 0) {
        console.log('Loading objects:', design.objects.length);
        canvasRef.current.loadFromJSON(design, () => {
          console.log('Design loaded, rendering canvas...');
          // Force re-render of all objects
          canvasRef.current?.getObjects().forEach(obj => {
            obj.set('dirty', true);
          });
          canvasRef.current?.renderAll();
          console.log('Canvas rendered with new design');
        });
      } else {
        console.log('No objects to load, rendering empty canvas');
        canvasRef.current.renderAll();
      }

      // Force immediate render
      canvasRef.current.renderAll();
    } catch (err) {
      console.error('Error loading design:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
      }
    }
  };

  // Expose methods via ref
  React.useImperativeHandle(ref, () => ({
    loadDesign,
    saveDesign
  }));

  const exportAsPNG = async () => {
    if (!canvasRef.current) return;

    try {
      // Store current active object and hide controls
      const activeObject = canvasRef.current.getActiveObject();
      if (activeObject) {
        canvasRef.current.discardActiveObject();
      }

      // Render once to clear controls
      canvasRef.current.renderAll();

      // Get canvas element and export
      const canvasElement = document.getElementById('design-canvas');
      if (!canvasElement) return;
      
      const dataUrl = await toPng(canvasElement);
      const link = document.createElement('a');
      link.download = `design-${projectId}.png`;
      link.href = dataUrl;
      link.click();

      // Restore active object if there was one
      if (activeObject) {
        canvasRef.current.setActiveObject(activeObject);
        canvasRef.current.renderAll();
      }
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  };

  return (
    <div className="design-editor">
      <div className="toolbar">
        <button onClick={() => addShape('rectangle')}>Add Rectangle</button>
        <button onClick={() => addShape('circle')}>Add Circle</button>
        <button onClick={() => addShape('text')}>Add Text</button>
        <button onClick={exportAsPNG}>Export PNG</button>
      </div>
      <canvas id="design-canvas" />
      <div className="collaborators">
        <h3>Collaborators ({collaborators.length})</h3>
        <ul>
          {collaborators.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
});
