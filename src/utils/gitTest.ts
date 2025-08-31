import { getFileService } from '../services/FileService';

export const testGitIntegration = async () => {
  try {
    const fileService = getFileService('dev');
    
    // Test basic file operations
    const testContent = '// Test file content\nconsole.log("Hello Git!");';
    await fileService.writeFile('test-file.ts', testContent);
    
    const content = await fileService.readFile('test-file.ts');
    console.log('File content:', content);
    
    const exists = await fileService.exists('test-file.ts');
    console.log('File exists:', exists);
    
    // Test Git operations
    const changes = await fileService.getChanges();
    console.log('Changes:', changes);
    
    const branch = await fileService.getCurrentBranch();
    console.log('Current branch:', branch);
    
    return { success: true, changes, branch };
  } catch (error) {
    console.error('Git integration test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
