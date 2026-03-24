const fs = require('fs');
const https = require('https');
const path = require('path');

const jsonPath = 'C:/Users/cleve/.gemini/antigravity/brain/2e42ba5c-5fc7-4064-be3f-19529820761a/.system_generated/steps/14/output.txt';
const outDir = path.join(__dirname, 'src', 'downloads');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

data.screens.forEach(screen => {
  if (screen.htmlCode && screen.htmlCode.downloadUrl) {
    const filename = `${screen.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    const filepath = path.join(outDir, filename);

    https.get(screen.htmlCode.downloadUrl, (res) => {
      const file = fs.createWriteStream(filepath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${filename}: ${err.message}`);
    });
  }
});
