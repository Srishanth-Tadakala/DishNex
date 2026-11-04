const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const OUT_DIR = path.resolve(__dirname, '..', 'docs', 'visual_qa', 'actual');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

fs.mkdirSync(OUT_DIR, { recursive: true });

const SCREENS = [
  { id: '01_splash', file: 'index.html' },
  { id: '02_onboarding_1', file: '(customer)/onboarding/index.html' },
  { id: '03_onboarding_2', file: '(customer)/onboarding/index.html' },
  { id: '04_onboarding_3', file: '(customer)/onboarding/index.html' },
  { id: '05_auth', file: '(auth)/sign-in.html' },
  { id: '06_home', file: '(customer)/(tabs)/index.html' },
  { id: '07_menu', file: '(customer)/(tabs)/menu.html' },
  { id: '08_biryani_list', file: '(customer)/category/[id].html' },
  { id: '09_food_details', file: '(customer)/food/[id].html' },
  { id: '10_search', file: '(customer)/search.html' },
  { id: '11_saved', file: '(customer)/(tabs)/saved.html' },
  { id: '12_cart', file: '(customer)/(tabs)/cart.html' },
  { id: '13_checkout', file: '(customer)/checkout.html' },
  { id: '14_confirmation', file: '(customer)/confirmation.html' },
];

for (const screen of SCREENS) {
  const filePath = path.join(DIST_DIR, ...screen.file.split('/'));
  const outFile = path.join(OUT_DIR, `${screen.id}.png`);
  const fileUrl = 'file:///' + filePath.replace(/\\/g, '/');

  const cmd = `"${CHROME_PATH}" --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-software-rasterizer --window-size=412,915 --screenshot="${outFile}" "${fileUrl}"`;
  try {
    execSync(cmd, { stdio: 'pipe' });
    const exists = fs.existsSync(outFile);
    const size = exists ? fs.statSync(outFile).size : 0;
    console.log(`[Captured] ${screen.id} -> size: ${size} bytes`);
  } catch (err) {
    console.error(`[Error] ${screen.id}:`, err.message);
  }
}
console.log('Capture finished.');
