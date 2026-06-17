import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

(async () => {
  try {
    // Load the original logo
    const img = await loadImage('public/logo.png');

    // Create 32x32 favicon
    const canvas = createCanvas(32, 32);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, 32, 32);

    const faviconBuffer = canvas.toBuffer('image/png');
    fs.writeFileSync('public/favicon-32x32.png', faviconBuffer);
    console.log('✅ Favicon created: public/favicon-32x32.png (32x32)');

    // Create 16x16 favicon
    const canvas16 = createCanvas(16, 16);
    const ctx16 = canvas16.getContext('2d');
    ctx16.drawImage(img, 0, 0, 16, 16);

    const favicon16Buffer = canvas16.toBuffer('image/png');
    fs.writeFileSync('public/favicon-16x16.png', favicon16Buffer);
    console.log('✅ Favicon created: public/favicon-16x16.png (16x16)');

    console.log('\n✨ All favicon files ready!');
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
