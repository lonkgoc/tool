import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TOOLS_PATH = path.join(__dirname, '../src/data/tools.ts');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const BASE_URL = 'https://tool260.com';

function generateSitemap() {
    try {
        const toolsContent = fs.readFileSync(TOOLS_PATH, 'utf-8');
        const slugRegex = /slug:\s*"([^"]+)"/g;
        let match;
        const slugs = [];

        while ((match = slugRegex.exec(toolsContent)) !== null) {
            slugs.push(match[1]);
        }

        const staticRoutes = [
            '',
            '/search',
            '/privacy',
            '/disclaimer'
        ];

        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

        // Static routes
        staticRoutes.forEach(route => {
            sitemap += `
  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
        });

        // Tool routes
        slugs.forEach(slug => {
            sitemap += `
  <url>
    <loc>${BASE_URL}/tools/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });

        sitemap += `
</urlset>`;

        fs.writeFileSync(SITEMAP_PATH, sitemap);
        console.log(`Sitemap generated with ${slugs.length} tools and ${staticRoutes.length} static routes.`);

    } catch (error) {
        console.error('Error generating sitemap:', error);
        process.exit(1);
    }
}

generateSitemap();
