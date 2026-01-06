import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_PATH = path.join(__dirname, '../src/data/tools.ts');
const DIST_PATH = path.join(__dirname, '../dist');
const INDEX_HTML_PATH = path.join(DIST_PATH, 'index.html');

function generateStaticPages() {
    console.log('Generating static pages for SEO...');

    if (!fs.existsSync(DIST_PATH)) {
        console.error('Dist folder not found. Run build first.');
        process.exit(1);
    }

    if (!fs.existsSync(INDEX_HTML_PATH)) {
        console.error('index.html not found in dist.');
        process.exit(1);
    }

    const indexContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

    // extract slugs from tools.ts
    const toolsContent = fs.readFileSync(TOOLS_PATH, 'utf-8');
    const slugRegex = /slug:\s*"([^"]+)"/g;
    let match;
    const slugs = [];

    while ((match = slugRegex.exec(toolsContent)) !== null) {
        if (match[1] !== 'home') { // Exclude home slug which redirects
            slugs.push(match[1]);
        }
    }

    const staticRoutes = [
        'search',
        'privacy',
        'disclaimer'
    ];

    const allRoutes = [...slugs.map(s => `tools/${s}`), ...staticRoutes];

    let count = 0;
    allRoutes.forEach(route => {
        const routePath = path.join(DIST_PATH, route);

        // Create directory
        fs.mkdirSync(routePath, { recursive: true });

        // Copy index.html to index.html in the directory
        fs.writeFileSync(path.join(routePath, 'index.html'), indexContent);
        count++;
    });

    console.log(`Successfully generated ${count} static HTML pages.`);
}

generateStaticPages();
