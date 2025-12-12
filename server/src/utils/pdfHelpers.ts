import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

const exec = promisify(execCb);

export async function hasBinary(name: string) {
  try {
    const cmd = process.platform === 'win32' ? `where ${name}` : `which ${name}`;
    await exec(cmd);
    return true;
  } catch (_err) {
    return false;
  }
}

export async function compressWithGhostscript(input: string, output: string, preset = '/ebook') {
  const gs = process.platform === 'win32' ? 'gswin64c' : 'gs';
  const exists = await hasBinary(gs);
  if (!exists) throw new Error('Ghostscript not found (gs or gswin64c)');
  const args = `-sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=${preset} -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${output}" "${input}"`;
  await exec(`${gs} ${args}`);
}

export async function qpdfEncrypt(input: string, output: string, userPassword = '', ownerPassword = '') {
  const exists = await hasBinary('qpdf');
  if (!exists) throw new Error('qpdf not found');
  const cmd = `qpdf --encrypt ${ownerPassword} ${userPassword} 256 -- "${input}" "${output}"`;
  await exec(cmd);
}

export async function qpdfDecrypt(input: string, output: string, password = '') {
  const exists = await hasBinary('qpdf');
  if (!exists) throw new Error('qpdf not found');
  const passArg = password ? `--password=${password}` : '';
  const cmd = `qpdf ${passArg} --decrypt "${input}" "${output}"`;
  await exec(cmd);
}

export async function pdftoppmToPng(input: string, outDir: string) {
  const exists = await hasBinary('pdftoppm');
  if (!exists) throw new Error('pdftoppm not found (poppler-utils)');
  const basename = path.join(outDir, 'page');
  // will produce page-1.png, page-2.png etc (pdftoppm default: output-1.png)
  const cmd = `pdftoppm -png "${input}" "${basename}"`;
  await exec(cmd);
}

export async function rotatePdf(inputPath: string, outputPath: string, angleDegrees: number) {
  const buf = fs.readFileSync(inputPath);
  const doc = await PDFDocument.load(buf);
  const angle = ((angleDegrees % 360) + 360) % 360; // normalize
  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    page.setRotation(degrees(angle));
  }
  const out = await doc.save();
  fs.writeFileSync(outputPath, out);
}

export async function watermarkPdf(inputPath: string, outputPath: string, text: string, options?: { size?: number; opacity?: number; color?: { r: number; g: number; b: number } }) {
  const buf = fs.readFileSync(inputPath);
  const doc = await PDFDocument.load(buf);
  const size = options?.size ?? 36;
  const opacity = options?.opacity ?? 0.15;
  const color = options?.color ?? { r: 0, g: 0, b: 0 };
  for (let i = 0; i < doc.getPageCount(); i++) {
    const page = doc.getPage(i);
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - (text.length / 2) * (size / 2),
      y: height / 2,
      size,
      rotate: degrees(-45),
      opacity,
      color: rgb(color.r, color.g, color.b)
    });
  }
  const out = await doc.save();
  fs.writeFileSync(outputPath, out);
}
