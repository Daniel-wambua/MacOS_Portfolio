// Vercel Serverless Function — fetches and parses RSS feed
// Endpoint: /api/feed

export default async function handler(req, res) {
    const RSS_URL = "https://havocsec.dev/rss.xml";

    try {
        const response = await fetch(RSS_URL, {
            headers: { "User-Agent": "MacOS-Portfolio-RSS/1.0" },
        });

        if (!response.ok) {
            return res.status(502).json({ error: "Failed to fetch RSS feed", status: response.status });
        }

        const xml = await response.text();

        // Parse XML manually (no dependencies needed)
        const items = [];
        const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

        for (const itemXml of itemMatches) {
            const title = extractTag(itemXml, "title");
            const link = extractTag(itemXml, "link");
            const pubDate = extractTag(itemXml, "pubDate");
            const description = extractTag(itemXml, "description");
            // Try to extract image from description, media:content, or enclosure
            const image = extractImage(itemXml);

            items.push({
                title: decodeEntities(title),
                link,
                pubDate,
                description: decodeEntities(stripHtml(description)).slice(0, 200),
                image,
            });
        }

        // Cache for 10 minutes on Vercel CDN, stale-while-revalidate for 1 hour
        res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.status(200).json({ items });
    } catch (err) {
        return res.status(500).json({ error: "Internal error fetching feed", message: err.message });
    }
}

function extractTag(xml, tag) {
    // Handle CDATA sections
    const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`);
    const cdataMatch = xml.match(cdataRegex);
    if (cdataMatch) return cdataMatch[1].trim();

    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
    const match = xml.match(regex);
    return match ? match[1].trim() : "";
}

function extractImage(xml) {
    // media:content
    const mediaMatch = xml.match(/<media:content[^>]*url=["']([^"']+)["']/);
    if (mediaMatch) return mediaMatch[1];

    // enclosure
    const enclosureMatch = xml.match(/<enclosure[^>]*url=["']([^"']+)["']/);
    if (enclosureMatch) return enclosureMatch[1];

    // img tag inside description/content
    const imgMatch = xml.match(/<img[^>]*src=["']([^"']+)["']/);
    if (imgMatch) return imgMatch[1];

    return null;
}

function stripHtml(html) {
    return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function decodeEntities(text) {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, "/");
}
