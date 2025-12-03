/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState } from 'react';

import { Button, Container, Row, Col } from 'react-bootstrap';
import { saveAs } from 'file-saver';

import {
  DesignEditor,
  // DesignEditorRef
} from '../../designs/design-editor/DesignEditor';

export const DesignEditorPage = () => {
  const [projectId, setProjectId] = useState('default-project');
  const [fileHandle, setFileHandle] = useState<any>(null);

  const handleSave = async () => {
    try {
      // if (!designEditorRef.current) {
      //   console.warn('Design editor ref not available');
      //   return;
      // }

      // Get and save current design state
      // const designData = designEditorRef.current.saveDesign();
      // if (!designData) {
      //   console.warn('No design data to save');
      //   return;
      // }

      // Include projectId in the saved data
      // const fullDesign = {
      //   ...designData,
      //   projectId
      // };

      // Force immediate render after save
      // if (designEditorRef.current) {
      //   designEditorRef.current.loadDesign(fullDesign);
      // }

      let newHandle;
      if ('showSaveFilePicker' in window && (window as any).showSaveFilePicker) {
        try {
          newHandle = await (window as any).showSaveFilePicker({
            types: [{
              description: 'Design Files',
              accept: {
                'application/json': ['.json'],
              },
            }],
            suggestedName: `${projectId}.json`
          });
        } catch (err) {
          console.warn('Error using showSaveFilePicker:', err);
          // Fall back to traditional download
          // const jsonData = JSON.stringify(fullDesign, null, 2);
          // const blob = new Blob([jsonData], { type: 'application/json' });
          // const url = URL.createObjectURL(blob);
          // const a = document.createElement('a');
          // a.href = url;
          // a.download = `${projectId}.json`;
          // a.click();
          // URL.revokeObjectURL(url);
          return;
        }
      } else {
        // Fall back to traditional download
        // const jsonData = JSON.stringify(fullDesign, null, 2);
        // const blob = new Blob([jsonData], { type: 'application/json' });
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = `${projectId}.json`;
        // a.click();
        // URL.revokeObjectURL(url);
        return;
      }

      // const jsonData = JSON.stringify(fullDesign, null, 2);
      // const writable = await newHandle.createWritable();
      // await writable.write(jsonData);
      // await writable.close();
      // setFileHandle(newHandle);
      // console.log('Design saved successfully:', fullDesign);
    } catch (err) {
      console.error('Error saving file:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
      }
    }
  };

  const [design, setDesign] = useState<any>(null);
  // const designEditorRef = useRef<DesignEditorRef>(null);

  const handleOpen = async () => {
    console.log('handleOpen triggered');
    try {
      // if (!window.showOpenFilePicker) {
      //   throw new Error('File System Access API not supported in this browser');
      // }

      console.log('Attempting to show file picker...');
      let handle;
      if ('showOpenFilePicker' in window) {
        // @ts-ignore
        [handle] = await window.showOpenFilePicker({
          types: [{
            description: 'Design Files',
            accept: {
              'application/json': ['.json'],
            },
          }],
          multiple: false
        });
      } else {
        throw new Error('File System Access API not supported');
      }

      if (!handle) {
        throw new Error('No file selected');
      }
      console.log('File handle obtained:', handle);

      const file = await handle.getFile();
      console.log('File object obtained:', file);

      const contents = await file.text();
      console.log('File contents loaded, length:', contents.length);

      let loadedDesign = JSON.parse(contents);
      console.log('Design parsed successfully:', loadedDesign);

      // Ensure design has proper structure
      if (!loadedDesign.objects || !loadedDesign.version) {
        loadedDesign = {
          version: '1.0',
          background: '#ffffff',
          objects: [],
          ...loadedDesign
        };
      }

      // Validate objects array exists
      if (!Array.isArray(loadedDesign.objects)) {
        loadedDesign.objects = [];
      }

      const newProjectId = loadedDesign.projectId || 'default-project';
      console.log('Setting projectId to:', newProjectId);
      setProjectId(newProjectId);

      console.log('Setting design state...');
      setDesign(loadedDesign);
      setFileHandle(handle);

      // Load the design into the editor
      // if (designEditorRef.current) {
      //   console.log('Calling loadDesign on editor ref with:', loadedDesign);
      //   designEditorRef.current.loadDesign(loadedDesign);
      // } else {
      //   console.warn('designEditorRef.current is null');
      // }
    } catch (err) {
      console.error('Error opening file:', err);
      if (err instanceof Error) {
        console.error('Error details:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });
      }
    }
  };

  const handleExport = () => {
    const designData = JSON.stringify({ projectId }, null, 2);
    const blob = new Blob([designData], { type: 'application/json' });
    saveAs(blob, `${projectId}.json`);
  };

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col>
          <h1>Design Editor</h1>
          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleOpen}>Open</Button>
            <Button variant="success" onClick={handleSave}>Save</Button>
            <Button variant="secondary" onClick={handleExport}>Export</Button>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* <DesignEditor
            projectId={projectId}
            ref={designEditorRef}
          /> */}
        </Col>
      </Row>
    </Container>
  );
};
