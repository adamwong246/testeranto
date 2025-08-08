import fs from "fs";
import path from "path";
import { marked } from "marked";

import * as sass from 'sass';

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
    
</head>

<body>

    <div class="container" style="padding-bottom: 5rem;">
        <div class="row">
            <div class="col-xs-0 col-sm-0 col-md-1">
            </div>

            <div class="col-xs-12 col-sm-12 col-md-10">
                <div id="container">
                    ${content.replace(/<p>⚠️(.*?)<\/p>/g, '<div class="warning">$1</div>')}
                </div>
            </div>
        
            <div class="col-xs-0 col-sm-0" col-md-1">
        </div>
    </div>

    <div class="container-fluid">
        <nav class="navbar fixed-bottom navbar-light bg-light">
            <div class="container-fluid justify-content-center">
                <ul class="nav">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://github.com/adamwong246/testeranto" target="_blank">GitHub</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="https://www.npmjs.com/package/testeranto" target="_blank">NPM</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>




    

    

</div>



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


        const result = sass.compile("src/style.scss");
        // console.log(result)
        fs.writeFileSync(path.join(outDir, "style.css"), result.css);


    } catch (err) {
        console.error("Error compiling docs:", err);
        process.exit(1);
    }
};

main();
