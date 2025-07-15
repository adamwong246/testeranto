import fs from "fs";
import path from "path";
import { marked } from "marked";

marked.use({
    renderer: {
        code: function (code, lang) {
            if (lang == "mermaid") return `<pre class="mermaid">${code}</pre>`;
            if (lang == "typescript")
                return `<pre class="language-typescript line-numbers"><code class="language-typescript">${code}</code></pre>`;
            return `<pre>${code}</pre>`;
        },
    },
});

// Simple HTML template with our CSS
const template = (title, content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    
    <!-- Prism.js CSS -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css" rel="stylesheet" />

    <!-- load style AFTER prism -->
    <link rel="stylesheet" href="style.css">

    
</head>
<body>
    <div class="parallax-background"></div>
    <div id="container">
        ${content.replace(/<p>⚠️(.*?)<\/p>/g, '<div class="warning">$1</div>')}
    </div>
    <!-- Prism.js JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            Prism.highlightAll();
            
            // Parallax effect
            const parallaxBg = document.querySelector('.parallax-background');
            window.addEventListener('scroll', function() {
                const scrollPosition = window.pageYOffset;
                parallaxBg.style.transform = 'translateY(scrollPosition)';
            });
        });
    </script>
</body>
</html>
`;

// Process markdown files
const processFile = (filePath) => {
    const markdown = fs.readFileSync(filePath, "utf8");
    return template(path.basename(filePath), marked.parse(markdown));
};

// Main function
const main = () => {
    try {
        // Create docs-output directory if it doesn't exist
        const outDir = "./";
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }

        // Process README.md -> documentation.html
        const readmeHtml = processFile("README.md");
        fs.writeFileSync(path.join(outDir, "index.html"), readmeHtml);
        console.log("Generated: index.html");

        // Process docs/index.md -> api-reference.html
        const docsHtml = processFile("docs/index.md");
        fs.writeFileSync(path.join(outDir, "docs.html"), docsHtml);
        console.log("Generated: docs.html");
    } catch (err) {
        console.error("Error compiling docs:", err);
        process.exit(1);
    }
};

main();
