import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { jsPDF } from 'jspdf';
import { marked } from 'marked';

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

export async function officeToHtml(inputPath: string, outDir: string) {
  // requires LibreOffice
  const cmd = `libreoffice --headless --convert-to html --outdir "${outDir}" "${inputPath}"`;
  await exec(cmd);
  const name = path.basename(inputPath).replace(/\.[^.]+$/, '.html');
  return path.join(outDir, name);
}

export async function htmlToPdf(htmlPath: string, pdfPath: string) {
  // requires wkhtmltopdf or puppeteer fallback
  try {
    const cmd = `wkhtmltopdf "${htmlPath}" "${pdfPath}"`;
    await exec(cmd);
  } catch (err) {
    throw new Error('wkhtmltopdf not found; install it or use puppeteer alternative');
  }
}

export async function markdownToPdf(mdText: string, pdfPath: string) {
  const html = String((marked as any)(mdText));
  const doc = new jsPDF();
  doc.text(mdText, 10, 10);
  doc.save(pdfPath);
}

export async function textToPdf(text: string, pdfPath: string) {
  const doc = new jsPDF();
  const lines = text.split('\n');
  let y = 10;
  for (const line of lines) {
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
    doc.text(line, 10, y);
    y += 5;
  }
  doc.save(pdfPath);
}

export async function pandocConvert(inputPath: string, fromFormat: string, toFormat: string, outputPath: string) {
  const cmd = `pandoc "${inputPath}" -f ${fromFormat} -t ${toFormat} -o "${outputPath}"`;
  await exec(cmd);
}

export async function rtfToPdf(rtfPath: string, pdfPath: string) {
  // convert RTF → HTML → PDF
  const htmlPath = rtfPath.replace('.rtf', '.html');
  try {
    const cmd = `pandoc "${rtfPath}" -f rtf -t html -o "${htmlPath}"`;
    await exec(cmd);
    await htmlToPdf(htmlPath, pdfPath);
    fs.unlinkSync(htmlPath);
  } catch (err) {
    throw new Error('rtf conversion requires pandoc and wkhtmltopdf');
  }
}
