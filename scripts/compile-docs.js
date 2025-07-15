import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

marked.use({
    renderer: {
        code: function (code, lang) {
            if (lang == 'mermaid') return `<pre class="mermaid">${code}</pre>`;
            return `<pre>${code}</pre>`;
        }
    }
})


// Simple HTML template with our CSS
const template = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'dark' });
    </script>
</head>
<body>
    <div id="container">
        ${content.replace(/<p>⚠️(.*?)<\/p>/g, '<div class="warning">$1</div>')}
    </div>
</body>
</html>
`;

// Process markdown files
const processFile = (filePath) => {
    const markdown = fs.readFileSync(filePath, 'utf8');
    return template(path.basename(filePath), marked.parse(markdown));
};

// Main function
const main = () => {
    try {
        // Create docs-output directory if it doesn't exist
        const outDir = './';
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }

        // Process README.md -> documentation.html
        const readmeHtml = processFile('README.md');
        fs.writeFileSync(path.join(outDir, 'index.html'), readmeHtml);
        console.log('Generated: index.html');

        // Process docs/index.md -> api-reference.html
        const docsHtml = processFile('docs/index.md');
        fs.writeFileSync(path.join(outDir, 'docs.html'), docsHtml);
        console.log('Generated: docs.html');


    } catch (err) {
        console.error('Error compiling docs:', err);
        process.exit(1);
    }
};

main();
