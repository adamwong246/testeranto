"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const renderer_1 = require("@revideo/renderer");
async function render() {
    console.log('Rendering video...');
    // This is the main function that renders the video
    const file = await (0, renderer_1.renderVideo)({
        projectFile: './src/project.tsx',
        settings: { logProgress: true },
    });
    console.log(`Rendered video to ${file}`);
}
render();
