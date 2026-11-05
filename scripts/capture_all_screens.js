const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const OUT_DIR = path.resolve(__dirname, '..', 'docs', 'visual_qa', 'actual');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 8089;

fs.mkdirSync(OUT_DIR, { recursive: true });

const SCREENS = [
  { id: '01_splash', path: '/' },
  { id: '02_onboarding_1', path: '/(customer)/onboarding?step=0' },
  { id: '03_onboarding_2', path: '/(customer)/onboarding?step=1' },
  { id: '04_onboarding_3', path: '/(customer)/onboarding?step=2' },
  { id: '05_auth', path: '/(auth)/sign-in' },
  { id: '06_home', path: '/(customer)/(tabs)' },
  { id: '07_menu', path: '/(customer)/(tabs)/menu' },
  { id: '08_biryani_list', path: '/(customer)/category/[id]' },
  { id: '09_food_details', path: '/(customer)/food/[id]' },
  { id: '10_search', path: '/(customer)/search' },
  { id: '11_saved', path: '/(customer)/(tabs)/saved' },
  { id: '12_cart', path: '/(customer)/(tabs)/cart' },
  { id: '13_checkout', path: '/(customer)/checkout' },
  { id: '14_confirmation', path: '/(customer)/confirmation' },
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  let cleanUrl = req.url.split('?')[0];
  if (cleanUrl === '/') cleanUrl = '/index.html';
  let targetFile = path.join(DIST_DIR, cleanUrl);

  if (!fs.existsSync(targetFile)) {
    if (fs.existsSync(targetFile + '.html')) {
      targetFile = targetFile + '.html';
    } else if (fs.existsSync(path.join(targetFile, 'index.html'))) {
      targetFile = path.join(targetFile, 'index.html');
    }
  }

  if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
    const ext = path.extname(targetFile).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(targetFile).pipe(res);
  } else {
    const fallback = path.join(DIST_DIR, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(fallback).pipe(res);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static server active at http://127.0.0.1:${PORT}`);

  try {
    for (const screen of SCREENS) {
      const outFile = path.join(OUT_DIR, `${screen.id}.png`);
      const url = `http://127.0.0.1:${PORT}${screen.path}`;

      const cmd = `"${CHROME_PATH}" --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --window-size=412,915 --virtual-time-budget=1200 --screenshot="${outFile}" "${url}"`;
      try {
        execSync(cmd, { stdio: 'pipe' });
        const size = fs.existsSync(outFile) ? fs.statSync(outFile).size : 0;
        console.log(`[Captured] ${screen.id} -> size: ${size} bytes`);
      } catch (err) {
        console.error(`[Error] ${screen.id}:`, err.message);
      }
    }
  } finally {
    server.close();
    console.log('Capture finished, server closed.');
  }
});
