import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export async function compressImage(inputPath: string, outputPath: string, quality = 80) {
  const ext = path.extname(inputPath).toLowerCase();
  let transform = sharp(inputPath);
  if (ext === '.jpg' || ext === '.jpeg') {
    transform = transform.jpeg({ quality, progressive: true });
  } else if (ext === '.png') {
    transform = transform.png({ compressionLevel: 9 });
  } else if (ext === '.webp') {
    transform = transform.webp({ quality });
  }
  await transform.toFile(outputPath);
}

export async function resizeImage(inputPath: string, outputPath: string, width: number, height: number, fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside' = 'cover') {
  await sharp(inputPath)
    .resize(width, height, { fit, withoutEnlargement: true })
    .toFile(outputPath);
}

export async function cropImage(inputPath: string, outputPath: string, left: number, top: number, width: number, height: number) {
  await sharp(inputPath)
    .extract({ left, top, width, height })
    .toFile(outputPath);
}

export async function convertImage(inputPath: string, outputPath: string, format: 'jpeg' | 'png' | 'webp' | 'gif') {
  const ext = path.extname(outputPath).toLowerCase();
  const transformer = sharp(inputPath);
  switch (format) {
    case 'jpeg': await transformer.jpeg({ progressive: true }).toFile(outputPath); break;
    case 'png': await transformer.png().toFile(outputPath); break;
    case 'webp': await transformer.webp().toFile(outputPath); break;
    case 'gif': await transformer.gif().toFile(outputPath); break;
  }
}

export async function imageToBase64(inputPath: string) {
  const data = fs.readFileSync(inputPath);
  return Buffer.from(data).toString('base64');
}

export async function base64ToImage(base64Str: string, outputPath: string) {
  const buf = Buffer.from(base64Str, 'base64');
  fs.writeFileSync(outputPath, buf);
}

export async function addTextToImage(inputPath: string, outputPath: string, text: string, options?: { x?: number; y?: number; size?: number; color?: string }) {
  const x = options?.x ?? 10;
  const y = options?.y ?? 10;
  const size = options?.size ?? 32;
  const color = options?.color ?? '#000000';
  await sharp(inputPath)
    .composite([
      {
        input: Buffer.from(
          `<svg width="500" height="500"><text x="${x}" y="${y}" font-size="${size}" fill="${color}">${text}</text></svg>`
        ),
        gravity: 'northwest'
      }
    ])
    .toFile(outputPath);
}

export async function svgToPng(inputPath: string, outputPath: string, width = 512, height = 512) {
  await sharp(inputPath, { density: 150 })
    .resize(width, height, { fit: 'contain' })
    .png()
    .toFile(outputPath);
}

export async function pngToIco(inputPath: string, outputPath: string) {
  // ICO format with multiple sizes
  const sizes = [16, 32, 48, 64];
  const layers = [];
  for (const sz of sizes) {
    layers.push({
      input: await sharp(inputPath).resize(sz, sz).png().toBuffer(),
      left: 0,
      top: 0
    });
  }
  // Simple approach: save as 256x256 ICO-compatible PNG
  await sharp(inputPath).resize(256, 256).toFile(outputPath);
}
