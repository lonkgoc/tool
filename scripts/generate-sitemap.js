import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_PATH = path.join(__dirname, '../src/data/tools.ts');
const PUBLIC_PATH = path.join(__dirname, '../public');
const BASE_URL = 'https://tool260.com';

function generateSitemap() {
    try {
        const toolsContent = fs.readFileSync(TOOLS_PATH, 'utf-8');
        // Regex to capture Category and Slug
        // Assumes category comes before slug in valid tool objects
        const toolRegex = /category:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"/g;

        let match;
        const tools = [];

        while ((match = toolRegex.exec(toolsContent)) !== null) {
            const category = match[1];
            const slug = match[2];

            if (slug !== 'home') { // Exclude home slug redirect
                tools.push({ category, slug });
            }
        }

        // Define groups
        const sitemaps = {
            'pdf': [],
            'image': [],
            'finance': [],
            'code-tools': [],
            'fun': [],
            'health': [],
            'productivity': [],
            'other': []
        };

        tools.forEach(tool => {
            const cat = tool.category;
            const slug = tool.slug.toLowerCase();

            if (cat === 'File Converters & Editors') {
                if (slug.includes('pdf')) {
                    sitemaps['pdf'].push(tool);
                } else if (slug.match(/image|jpg|png|webp|gif|ico|svg|bmp|tiff/)) {
                    sitemaps['image'].push(tool);
                } else {
                    sitemaps['other'].push(tool); // e.g. zip, json-to-csv
                }
            } else if (cat === 'Image & Design Tools') {
                sitemaps['image'].push(tool);
            } else if (cat === 'Finance & Calculators') {
                sitemaps['finance'].push(tool);
            } else if (cat === 'Text & Code Tools' || cat === 'Web & SEO Tools') {
                sitemaps['code-tools'].push(tool);
            } else if (cat === 'Fun & Entertainment' || cat === 'Generators & Makers' || cat === 'Time & Utilities') {
                sitemaps['fun'].push(tool);
            } else if (cat === 'Health & Fitness') {
                sitemaps['health'].push(tool);
            } else if (cat === 'Productivity & Planning') {
                sitemaps['productivity'].push(tool);
            } else {
                sitemaps['other'].push(tool);
            }
        });

        const generatedFiles = [];

        // Generate Tool Sitemaps
        for (const [key, toolList] of Object.entries(sitemaps)) {
            if (toolList.length === 0) continue;

            const filename = `sitemap-${key}.xml`;
            let content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

            toolList.forEach(tool => {
                content += `
  <url>
    <loc>${BASE_URL}/tools/${tool.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
            });

            content += `
</urlset>`;

            fs.writeFileSync(path.join(PUBLIC_PATH, filename), content);
            generatedFiles.push(filename);
            console.log(`Generated ${filename} with ${toolList.length} URLs`);
        }

        // Generate Main Pages Sitemap
        const staticRoutes = ['', '/search', '/privacy', '/disclaimer'];
        let mainContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        staticRoutes.forEach(route => {
            mainContent += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        mainContent += `
</urlset>`;

        fs.writeFileSync(path.join(PUBLIC_PATH, 'sitemap-main.xml'), mainContent);
        generatedFiles.push('sitemap-main.xml');
        console.log(`Generated sitemap-main.xml`);

        // Generate Sitemap Index
        let indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        generatedFiles.forEach(file => {
            indexContent += `
  <sitemap>
    <loc>${BASE_URL}/${file}</loc>
  </sitemap>`;
        });

        indexContent += `
</sitemapindex>`;

        fs.writeFileSync(path.join(PUBLIC_PATH, 'sitemap.xml'), indexContent);
        console.log('Generated sitemap.xml index file.');

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
