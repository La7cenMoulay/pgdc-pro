import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'src', 'initialData.json');

function runCommand(command) {
    return new Promise((resolve, reject) => {
        console.log(`[EXEC] Running: ${command}`);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`[ERROR] ${error.message}`);
                return reject(error);
            }
            if (stderr) console.log(`[STDERR] ${stderr}`);
            console.log(`[STDOUT] ${stdout}`);
            resolve(stdout);
        });
    });
}

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
        req.on('end', async () => {
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

                // Automated Git and Deployment
                try {
                    console.log('[SYNC] Starting Git operations...');
                    await runCommand('git add src/initialData.json');
                    await runCommand('git commit -m "Auto-sync from Admin Panel"');
                    await runCommand('git push origin main');
                    console.log('[SYNC] Data pushed to GitHub. Starting deployment...');
                    await runCommand('npm run deploy');
                    console.log('[SYNC] Deployment complete!');
                    res.end('Synced and Deployed Successfully');
                } catch (gitErr) {
                    console.error('[SYNC] Git/Deploy Error:', gitErr.message);
                    res.statusCode = 500;
                    res.end('Synced locally but Git/Deploy failed: ' + gitErr.message);
                }

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
server.listen(PORT, 'localhost', () => {
    console.log(`[SYNC] Node Sync Server running on http://localhost:${PORT}`);
    console.log(`[SYNC] Keep this terminal open while syncing.`);
});
