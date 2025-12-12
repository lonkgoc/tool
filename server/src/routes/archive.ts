import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { createZip, extractZip, createTar, extractTar, extract7z, extractRar, mergeFiles, splitFile, bulkRename, detectFileType, generateFileHash, findDuplicates, compareFiles, validateFile } from '../utils/archiveHelpers';

const router = Router();
const UPLOADS = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({ destination: UPLOADS, filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

router.post('/zip-create', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) return res.status(400).json({ error: 'no files' });
    const outPath = path.join(UPLOADS, `archive-${Date.now()}.zip`);
    await createZip(files.map(f => f.path), outPath);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/zip-extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outDir = path.join(UPLOADS, `extracted-${Date.now()}`);
    fs.mkdirSync(outDir, { recursive: true });
    const entries = await extractZip(file.path, outDir);
    res.json({ files: entries, dir: path.basename(outDir) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/tar-create', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) return res.status(400).json({ error: 'no files' });
    const outPath = path.join(UPLOADS, `archive-${Date.now()}.tar.gz`);
    await createTar(files.map(f => f.path), outPath);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/tar-extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outDir = path.join(UPLOADS, `extracted-${Date.now()}`);
    fs.mkdirSync(outDir, { recursive: true });
    await extractTar(file.path, outDir);
    res.json({ dir: path.basename(outDir) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/7z-extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outDir = path.join(UPLOADS, `extracted-${Date.now()}`);
    fs.mkdirSync(outDir, { recursive: true });
    await extract7z(file.path, outDir);
    res.json({ dir: path.basename(outDir) });
  } catch (err: any) {
    res.status(500).json({ error: '7z extraction requires 7z binary: ' + (err.message || String(err)) });
  }
});

router.post('/rar-extract', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outDir = path.join(UPLOADS, `extracted-${Date.now()}`);
    fs.mkdirSync(outDir, { recursive: true });
    await extractRar(file.path, outDir);
    res.json({ dir: path.basename(outDir) });
  } catch (err: any) {
    res.status(500).json({ error: 'RAR extraction requires unrar binary: ' + (err.message || String(err)) });
  }
});

router.post('/merge', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) return res.status(400).json({ error: 'no files' });
    const outPath = path.join(UPLOADS, `merged-${Date.now()}`);
    await mergeFiles(files.map(f => f.path), outPath);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/split', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const chunkSize = Number(req.body.chunkSize) || 1024 * 1024; // 1MB default
    const outDir = path.join(UPLOADS, `split-${Date.now()}`);
    fs.mkdirSync(outDir, { recursive: true });
    const chunks = await splitFile(file.path, outDir, chunkSize);
    res.json({ chunks });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/bulk-rename', async (req, res) => {
  try {
    const { renames, baseDir } = req.body; // renames: [{ oldName, newName }]
    if (!renames || !baseDir) return res.status(400).json({ error: 'missing renames or baseDir' });
    const result = await bulkRename(renames, baseDir);
    res.json({ renamed: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/detect-type', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const type = detectFileType(file.path);
    res.json({ type, filename: file.filename });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/hash', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const algo = req.body.algo || 'sha256';
    const hash = await generateFileHash(file.path, algo);
    res.json({ hash, algo });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/find-duplicates', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) return res.status(400).json({ error: 'no files' });
    const dups = await findDuplicates(files.map(f => f.path));
    res.json({ duplicates: dups });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/compare', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length < 2) return res.status(400).json({ error: 'need 2 files' });
    const result = await compareFiles(files[0].path, files[1].path);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/validate', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const result = await validateFile(file.path);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
