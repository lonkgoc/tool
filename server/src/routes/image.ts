import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { compressImage, resizeImage, cropImage, convertImage, imageToBase64, base64ToImage, addTextToImage, svgToPng, pngToIco } from '../utils/imageHelpers';

const router = Router();
const UPLOADS = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({ destination: UPLOADS, filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const quality = Number(req.body.quality) || 80;
    const outPath = path.join(UPLOADS, `${file.filename}-compressed${path.extname(file.filename)}`);
    await compressImage(file.path, outPath, quality);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/resize', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const width = Number(req.body.width) || 800;
    const height = Number(req.body.height) || 600;
    const fit = req.body.fit || 'cover';
    const outPath = path.join(UPLOADS, `${file.filename}-resized${path.extname(file.filename)}`);
    await resizeImage(file.path, outPath, width, height, fit as any);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/crop', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const left = Number(req.body.left) || 0;
    const top = Number(req.body.top) || 0;
    const width = Number(req.body.width) || 100;
    const height = Number(req.body.height) || 100;
    const outPath = path.join(UPLOADS, `${file.filename}-cropped${path.extname(file.filename)}`);
    await cropImage(file.path, outPath, left, top, width, height);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const format = req.body.format || 'png';
    const ext = format === 'jpeg' ? '.jpg' : `.${format}`;
    const outPath = path.join(UPLOADS, `${file.filename}-converted${ext}`);
    await convertImage(file.path, outPath, format as any);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/to-base64', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const b64 = await imageToBase64(file.path);
    res.json({ base64: b64 });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/from-base64', async (req, res) => {
  try {
    const { base64, format } = req.body;
    if (!base64) return res.status(400).json({ error: 'no base64' });
    const outPath = path.join(UPLOADS, `base64-${Date.now()}.${format || 'png'}`);
    await base64ToImage(base64, outPath);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/add-text', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const text = req.body.text || 'Text';
    const x = Number(req.body.x) || 10;
    const y = Number(req.body.y) || 10;
    const size = Number(req.body.size) || 32;
    const outPath = path.join(UPLOADS, `${file.filename}-text${path.extname(file.filename)}`);
    await addTextToImage(file.path, outPath, text, { x, y, size });
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/svg-to-png', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const width = Number(req.body.width) || 512;
    const height = Number(req.body.height) || 512;
    const outPath = path.join(UPLOADS, `${file.filename}.png`);
    await svgToPng(file.path, outPath, width, height);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/png-to-ico', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}.ico`);
    await pngToIco(file.path, outPath);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
