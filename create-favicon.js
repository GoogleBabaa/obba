import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

const sourceLogo = 'LOGO-removebg-preview.png';

function renderPng(img, size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
  return canvas.toBuffer('image/png');
}

function pngToIco(entries) {
  const headerSize = 6;
  const dirSize = 16 * entries.length;
  let imageOffset = headerSize + dirSize;
  const header = Buffer.alloc(headerSize + dirSize);

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);

  entries.forEach((entry, index) => {
    const offset = headerSize + index * 16;
    header.writeUInt8(entry.size >= 256 ? 0 : entry.size, offset);
    header.writeUInt8(entry.size >= 256 ? 0 : entry.size, offset + 1);
    header.writeUInt8(0, offset + 2);
    header.writeUInt8(0, offset + 3);
    header.writeUInt16LE(1, offset + 4);
    header.writeUInt16LE(32, offset + 6);
    header.writeUInt32LE(entry.buffer.length, offset + 8);
    header.writeUInt32LE(imageOffset, offset + 12);
    imageOffset += entry.buffer.length;
  });

  return Buffer.concat([header, ...entries.map((entry) => entry.buffer)]);
}

(async () => {
  const img = await loadImage(sourceLogo);
  const favicon16 = renderPng(img, 16);
  const favicon32 = renderPng(img, 32);
  const appleTouch = renderPng(img, 180);
  fs.copyFileSync(sourceLogo, 'public/logo.png');
  fs.writeFileSync('public/favicon-16x16.png', favicon16);
  fs.writeFileSync('public/favicon-32x32.png', favicon32);
  fs.writeFileSync('public/apple-touch-icon.png', appleTouch);
  fs.writeFileSync('public/favicon.ico', pngToIco([
    { size: 16, buffer: favicon16 },
    { size: 32, buffer: favicon32 },
  ]));

  const svgData = fs.readFileSync(sourceLogo).toString('base64');
  fs.writeFileSync(
    'public/favicon.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${svgData}"/></svg>\n`
  );

  console.log('Generated logo and favicon assets from LOGO-removebg-preview.png');
})();
