import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { PDFDocument } from 'pdf-lib';
import { rotatePdf, watermarkPdf, compressWithGhostscript, qpdfEncrypt, qpdfDecrypt, pdftoppmToPng, hasBinary } from '../utils/pdfHelpers';

const router = Router();

const UPLOADS = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({ destination: UPLOADS, filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

router.post('/text', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const data = fs.readFileSync(file.path);
    const parsed = await pdfParse(data as any);
    res.json({ text: parsed.text });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/merge', upload.array('files'), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) return res.status(400).json({ error: 'no files' });
    const merged = await PDFDocument.create();
    for (const f of files) {
      const buf = fs.readFileSync(f.path);
      const doc = await PDFDocument.load(buf);
      const copied = await merged.copyPages(doc, doc.getPageIndices());
      copied.forEach(p => merged.addPage(p));
    }
    const out = await merged.save();
    const outPath = path.join(UPLOADS, `merged-${Date.now()}.pdf`);
    fs.writeFileSync(outPath, out);
    res.json({ file: path.basename(outPath), path: outPath });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/split', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const buf = fs.readFileSync(file.path);
    const doc = await PDFDocument.load(buf);
    const outFiles: string[] = [];
    for (let i = 0; i < doc.getPageCount(); i++) {
      const newDoc = await PDFDocument.create();
      const [copied] = await newDoc.copyPages(doc, [i]);
      newDoc.addPage(copied);
      const pdfBytes = await newDoc.save();
      const outPath = path.join(UPLOADS, `${file.filename}-page-${i + 1}.pdf`);
      fs.writeFileSync(outPath, pdfBytes);
      outFiles.push(path.basename(outPath));
    }
    res.json({ files: outFiles });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/images-to-pdf', upload.array('images'), async (req, res) => {
  try {
    const images = req.files as Express.Multer.File[] | undefined;
    if (!images || images.length === 0) return res.status(400).json({ error: 'no images' });
    const pdfDoc = await PDFDocument.create();
    for (const img of images) {
      const imgBuf = fs.readFileSync(img.path);
      let embedded;
      const mime = img.mimetype || '';
      if (mime.includes('png')) embedded = await pdfDoc.embedPng(imgBuf);
      else embedded = await pdfDoc.embedJpg(imgBuf);
      const page = pdfDoc.addPage();
      const { width, height } = embedded.scale(1);
      page.setSize(width, height);
      page.drawImage(embedded, { x: 0, y: 0, width, height });
    }
    const pdfBytes = await pdfDoc.save();
    const outPath = path.join(UPLOADS, `images-${Date.now()}.pdf`);
    fs.writeFileSync(outPath, pdfBytes);
    res.json({ file: path.basename(outPath), path: outPath });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/rotate', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const angle = Number(req.body.angle || 90);
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}-rotated.pdf`);
    await rotatePdf(file.path, outPath, angle);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/watermark', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const text = req.body.text || 'Watermark';
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}-watermarked.pdf`);
    await watermarkPdf(file.path, outPath, text, { size: Number(req.body.size) || 48, opacity: Number(req.body.opacity) || 0.12 });
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/compress', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}-compressed.pdf`);
    try {
      await compressWithGhostscript(file.path, outPath, req.body.preset || '/ebook');
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Compression failed: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/add-password', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const user = req.body.user || '';
    const owner = req.body.owner || '';
    if (!file) return res.status(400).json({ error: 'no file' });
    try {
      const outPath = path.join(UPLOADS, `${file.filename}-encrypted.pdf`);
      await qpdfEncrypt(file.path, outPath, user, owner);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'qpdf encrypt failed: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/remove-password', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const pass = req.body.password || '';
    if (!file) return res.status(400).json({ error: 'no file' });
    try {
      const outPath = path.join(UPLOADS, `${file.filename}-decrypted.pdf`);
      await qpdfDecrypt(file.path, outPath, pass);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'qpdf decrypt failed: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/to-images', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    // create temporary dir
    const tmpDir = path.join(UPLOADS, `${file.filename}-pages`);
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
    try {
      await pdftoppmToPng(file.path, tmpDir);
      // list pngs
      const imgs = fs.readdirSync(tmpDir).filter(f => f.toLowerCase().endsWith('.png'));
      res.json({ images: imgs.map(n => path.join(path.basename(tmpDir), n)) });
    } catch (err: any) {
      res.status(500).json({ error: 'pdftoppm failed: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
