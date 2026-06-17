import { createCanvas } from 'canvas';
import fs from 'fs';

// Create logo image
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Background - white
ctx.fillStyle = '#FFFFFF';
ctx.fillRect(0, 0, 512, 512);

// Create gradient
const gradient = ctx.createLinearGradient(50, 50, 462, 462);
gradient.addColorStop(0, '#2563EB'); // Blue
gradient.addColorStop(0.5, '#0EA5E9'); // Sky Blue
gradient.addColorStop(1, '#06B6D4'); // Cyan

// Draw rounded rectangle background
ctx.fillStyle = gradient;
ctx.beginPath();
ctx.roundRect(50, 50, 412, 412, 60);
ctx.fill();

// Draw dollar sign
ctx.fillStyle = '#FFFFFF';
ctx.font = 'bold 280px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('$', 256, 256);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('public/logo.png', buffer);
console.log('✅ Logo created: public/logo.png (512x512)');

// Create smaller version for favicon (32x32)
const faviconCanvas = createCanvas(32, 32);
const faviconCtx = faviconCanvas.getContext('2d');

const fGradient = faviconCtx.createLinearGradient(3, 3, 29, 29);
fGradient.addColorStop(0, '#2563EB');
fGradient.addColorStop(1, '#06B6D4');

faviconCtx.fillStyle = fGradient;
faviconCtx.beginPath();
faviconCtx.roundRect(3, 3, 26, 26, 4);
faviconCtx.fill();

faviconCtx.fillStyle = '#FFFFFF';
faviconCtx.font = 'bold 20px Arial';
faviconCtx.textAlign = 'center';
faviconCtx.textBaseline = 'middle';
faviconCtx.fillText('$', 16, 16);

const faviconBuffer = faviconCanvas.toBuffer('image/png');
fs.writeFileSync('public/favicon-32x32.png', faviconBuffer);
console.log('✅ Favicon created: public/favicon-32x32.png (32x32)');

console.log('\n✨ Both logos ready for SERP!');
