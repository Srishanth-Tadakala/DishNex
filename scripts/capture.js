const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlFile = path.resolve(__dirname, '..', 'dist', 'index.html');
const outFile = path.resolve(__dirname, '..', 'docs', 'visual_qa', 'test_node.png');

console.log('Target HTML:', htmlFile);
console.log('Out file:', outFile);

try {
  const cmd = `"${chromePath}" --headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage --disable-software-rasterizer --screenshot="${outFile}" --window-size=412,915 "file:///${htmlFile.replace(/\\/g, '/')}"`;
  console.log('Running cmd:', cmd);
  const out = execSync(cmd, { stdio: 'pipe' });
  console.log('Output:', out.toString());
  console.log('Exists:', fs.existsSync(outFile));
} catch (e) {
  console.error('Error running Chrome:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout.toString());
  if (e.stderr) console.log('stderr:', e.stderr.toString());
}
