const assert = require('assert');
const vscode = require('vscode');

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('adamwong246.testeranto'));
    });

    test('Should activate', async () => {
        const ext = vscode.extensions.getExtension('adamwong246.testeranto');
        await ext.activate();
        assert.ok(ext.isActive);
    });
});
