import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { createHash } from 'crypto';

const exec = promisify(execCb);

export async function createZip(filePaths: string[], outputPath: string) {
  const zip = new AdmZip();
  for (const fpath of filePaths) {
    if (fs.statSync(fpath).isDirectory()) {
      zip.addLocalFolder(fpath);
    } else {
      zip.addLocalFile(fpath);
    }
  }
  zip.writeZip(outputPath);
}

export async function extractZip(zipPath: string, outDir: string) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outDir, true);
  return zip.getEntries().map((e: any) => e.entryName);
}

export async function createTar(filePaths: string[], outputPath: string) {
  const cmd = `tar czf "${outputPath}" ${filePaths.map(f => `"${f}"`).join(' ')}`;
  await exec(cmd);
}

export async function extractTar(tarPath: string, outDir: string) {
  const cmd = `tar xzf "${tarPath}" -C "${outDir}"`;
  await exec(cmd);
}

export async function extract7z(sevenZPath: string, outDir: string) {
  // requires 7z installed
  const cmd = `7z x "${sevenZPath}" -o"${outDir}"`;
  await exec(cmd);
}

export async function extractRar(rarPath: string, outDir: string) {
  // requires unrar installed
  const cmd = `unrar x "${rarPath}" "${outDir}"`;
  await exec(cmd);
}

export async function mergeFiles(filePaths: string[], outputPath: string) {
  const writeStream = fs.createWriteStream(outputPath);
  for (const fpath of filePaths) {
    const data = fs.readFileSync(fpath);
    writeStream.write(data);
  }
  writeStream.end();
  return new Promise<void>((resolve, reject) => {
    writeStream.on('finish', () => resolve());
    writeStream.on('error', reject);
  });
}

export async function splitFile(inputPath: string, outDir: string, chunkSize: number) {
  const data = fs.readFileSync(inputPath);
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkPath = path.join(outDir, `chunk-${chunks.length + 1}`);
    fs.writeFileSync(chunkPath, chunk);
    chunks.push(path.basename(chunkPath));
  }
  return chunks;
}

export async function bulkRename(files: { oldName: string; newName: string }[], baseDir: string) {
  const renamed = [];
  for (const { oldName, newName } of files) {
    const oldPath = path.join(baseDir, oldName);
    const newPath = path.join(baseDir, newName);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      renamed.push(newName);
    }
  }
  return renamed;
}

export function detectFileType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.zip': 'application/zip',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

export async function generateFileHash(filePath: string, algo = 'sha256'): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash(algo);
    const stream = fs.createReadStream(filePath);
    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

export async function findDuplicates(filePaths: string[]) {
  const hashes: Record<string, string[]> = {};
  for (const fpath of filePaths) {
    const h = await generateFileHash(fpath);
    if (!hashes[h]) hashes[h] = [];
    hashes[h].push(fpath);
  }
  return Object.entries(hashes).filter(([_, files]) => files.length > 1).map(([hash, files]) => ({ hash, files }));
}

export async function compareFiles(file1: string, file2: string): Promise<{ identical: boolean; size1: number; size2: number }> {
  const stat1 = fs.statSync(file1);
  const stat2 = fs.statSync(file2);
  if (stat1.size !== stat2.size) return { identical: false, size1: stat1.size, size2: stat2.size };
  const hash1 = await generateFileHash(file1);
  const hash2 = await generateFileHash(file2);
  return { identical: hash1 === hash2, size1: stat1.size, size2: stat2.size };
}

export async function validateFile(filePath: string) {
  const stats = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const type = detectFileType(filePath);
  return {
    exists: true,
    size: stats.size,
    ext,
    type,
    readable: fs.accessSync(filePath, fs.constants.R_OK), 
    modified: stats.mtime
  };
}
