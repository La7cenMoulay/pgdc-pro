const http = require('http');
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, 'src', 'initialData.json');

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/sync') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                // We only want to save theme, hero, about, anniversary, gallery, members
                const cleanData = {
                    theme: data.theme,
                    hero: data.hero,
                    about: data.about,
                    anniversary: data.anniversary,
                    gallery: data.gallery,
                    members: data.members
                };
                fs.writeFileSync(DATA_PATH, JSON.stringify(cleanData, null, 4));
                console.log('[SYNC] Successfully updated initialData.json');
                res.end('Synced Successfully');
            } catch (err) {
                console.error('[SYNC] Error:', err.message);
                res.statusCode = 500;
                res.end('Sync Failed: ' + err.message);
            }
        });
    } else {
        res.statusCode = 404;
        res.end();
    }
});

const PORT = 3500;
server.listen(PORT, () => {
    console.log(`[SYNC] Node Sync Server running on http://localhost:${PORT}`);
    console.log(`[SYNC] Keep this terminal open while syncing.`);
});
