(function() {
    const vscode = acquireVsCodeApi();
    let currentTestId = null;
    let currentFilePath = null;

    // This function is called when files are updated from the extension
    function handleUpdateFiles(files) {
        const fileTreeElement = document.getElementById('file-tree');
        fileTreeElement.innerHTML = '';
        
        if (!files || files.length === 0) {
            fileTreeElement.innerHTML = '<div class="file-item">No files found</div>';
            return;
        }
        
        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-item';
            fileElement.innerHTML = `
                <span class="file-name">${file.name}</span>
                <span class="file-path">${file.path}</span>
            `;
            fileElement.dataset.filePath = file.path;
            
            fileElement.addEventListener('click', () => {
                // Remove selected class from all file items
                document.querySelectorAll('.file-item').forEach(item => {
                    item.classList.remove('selected');
                });
                // Add selected class to clicked item
                fileElement.classList.add('selected');
                
                currentFilePath = file.path;
                vscode.postMessage({
                    command: 'selectFile',
                    filePath: file.path
                });
            });
            
            fileTreeElement.appendChild(fileElement);
        });
    }

    // Handle messages from the extension
    window.addEventListener('message', event => {
        const message = event.data;
        
        switch (message.command) {
            case 'updateFiles':
                handleUpdateFiles(message.files);
                break;
            case 'updateEditor':
                const editor = document.getElementById('file-editor');
                const saveButton = document.getElementById('save-button');
                const editorPlaceholder = document.getElementById('editor-placeholder');
                
                if (editorPlaceholder) {
                    editorPlaceholder.style.display = 'none';
                }
                if (editor) {
                    editor.style.display = 'block';
                    editor.value = message.content || '';
                    editor.dataset.filePath = message.filePath;
                }
                if (saveButton) {
                    saveButton.style.display = 'block';
                }
                currentFilePath = message.filePath;
                break;
        }
    });

    // Initialize when the page loads
    document.addEventListener('DOMContentLoaded', () => {
        // The test list is already populated in the HTML
        // Add click handlers to test items if they exist
        const testItems = document.querySelectorAll('.test-item');
        testItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove selected class from all test items
                document.querySelectorAll('.test-item').forEach(testItem => {
                    testItem.classList.remove('selected');
                });
                // Add selected class to clicked item
                this.classList.add('selected');
                
                const testId = this.dataset.testId;
                currentTestId = testId;
                vscode.postMessage({
                    command: 'selectTest',
                    testId: testId
                });
            });
        });
        
        // Initialize save button
        const saveButton = document.getElementById('save-button');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                const editor = document.getElementById('file-editor');
                if (currentFilePath && editor) {
                    vscode.postMessage({
                        command: 'saveFile',
                        filePath: currentFilePath,
                        content: editor.value
                    });
                } else {
                    vscode.postMessage({
                        command: 'showError',
                        message: 'No file selected to save'
                    });
                }
            });
        }
        
        // Select the first test by default if exists
        const firstTest = document.querySelector('.test-item');
        if (firstTest) {
            firstTest.click();
        }
    });
})();
