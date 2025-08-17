import fs from "fs";
import path from "path";
import { micromark } from 'micromark';
import { gfmTable, gfmTableHtml } from 'micromark-extension-gfm-table';
import * as sass from 'sass';

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
    

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2BREL4738L"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-2BREL4738L');
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            Prism.highlightAll();
            
            const parallaxBg = document.querySelector('.parallax-background');
            if (parallaxBg) {
                window.addEventListener('scroll', function() {
                    const scrollPosition = window.pageYOffset;
                    parallaxBg.style.transform = 'translateY(' + scrollPosition + 'px)';
                });
            }
        });
    </script>
    
</head>

<body>

    <div class="container-fluid" style="padding-bottom: 5rem;">
        <div class="row">

            <div class="col-xs-12 col-sm-12 col-md-12">
                <div id="container-fluid">
                    ${content}
                </div>
            </div>
        

        </div>
    </div>

    <div class="container-fluid">
        <nav class="navbar fixed-bottom navbar-light bg-light">
            <div class="container-fluid justify-content-center">
                <ul class="nav">
                    <li class="nav-item">
                        <a class="nav-link" href="README.html">README</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="docs.html">Docs</a>
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
    const html = micromark(markdown, {
        allowDangerousHtml: true,
        extensions: [gfmTable()],
        htmlExtensions: [gfmTableHtml()]
    });
    return template(path.basename(filePath), html);
};

// Main function
const main = async () => {
    try {
        // Create docs-output directory if it doesn't exist
        const outDir = "./";
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir);
        }


        // Process frontpage template -> index.html
        const frontpageContent = fs.readFileSync("src/templates/frontpage.html", "utf8");
        fs.writeFileSync(path.join(outDir, "index.html"), template("Testeranto", frontpageContent));
        console.log("Generated: index.html");

        // Process README.md -> README.html
        const readmeHtml = processFile("README.md");
        fs.writeFileSync(path.join(outDir, "README.html"), readmeHtml);
        console.log("Generated: README.html");

        // Process docs/index.md -> docs.html 
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
