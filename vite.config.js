import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// Local dev plugin to serve /api/feed (mimics the Vercel serverless function)
function rssFeedPlugin() {
  return {
    name: 'rss-feed-dev',
    configureServer(server) {
      server.middlewares.use('/api/feed', async (req, res) => {
        try {
          const response = await fetch('https://havocsec.dev/rss.xml', {
            headers: { 'User-Agent': 'MacOS-Portfolio-RSS/1.0' },
          });
          if (!response.ok) {
            res.statusCode = 502;
            res.end(JSON.stringify({ error: 'Failed to fetch RSS' }));
            return;
          }
          const xml = await response.text();
          const items = [];
          const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
          for (const itemXml of itemMatches) {
            const title = extractTag(itemXml, 'title');
            const link = extractTag(itemXml, 'link');
            const pubDate = extractTag(itemXml, 'pubDate');
            const description = extractTag(itemXml, 'description');
            const image = extractImage(itemXml);
            items.push({
              title: decodeEntities(title),
              link,
              pubDate,
              description: decodeEntities(stripHtml(description)).slice(0, 200),
              image,
            });
          }
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ items }));
        } catch (err) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

function extractTag(xml, tag) {
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`);
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractImage(xml) {
  const mediaMatch = xml.match(/<media:content[^>]*url=["']([^"']+)["']/);
  if (mediaMatch) return mediaMatch[1];
  const enclosureMatch = xml.match(/<enclosure[^>]*url=["']([^"']+)["']/);
  if (enclosureMatch) return enclosureMatch[1];
  const imgMatch = xml.match(/<img[^>]*src=["']([^"']+)["']/);
  if (imgMatch) return imgMatch[1];
  return null;
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x27;/g, "'").replace(/&#x2F;/g, '/');
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), rssFeedPlugin()],
  resolve: {
    alias: {
      '#components': resolve(dirname(fileURLToPath(import.meta.url)), 'src/components'),
      '#constants': resolve(dirname(fileURLToPath(import.meta.url)), 'src/constants'),
      '#store': resolve(dirname(fileURLToPath(import.meta.url)), 'src/store'),
      '#hoc': resolve(dirname(fileURLToPath(import.meta.url)), 'src/hoc'),
       '#windows': resolve(dirname(fileURLToPath(import.meta.url)), 'src/windows'),
    },
  },
});
