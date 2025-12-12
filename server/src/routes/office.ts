import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { officeToHtml, htmlToPdf, markdownToPdf, textToPdf, pandocConvert, rtfToPdf } from '../utils/officeHelpers';
import { jsPDF } from 'jspdf';

const router = Router();
const UPLOADS = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({ destination: UPLOADS, filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

router.post('/text-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const text = fs.readFileSync(file.path, 'utf-8');
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    await textToPdf(text, outPath);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/markdown-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const md = fs.readFileSync(file.path, 'utf-8');
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    await markdownToPdf(md, outPath);
    res.json({ file: path.basename(outPath) });
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/rtf-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    try {
      await rtfToPdf(file.path, outPath);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires pandoc and wkhtmltopdf: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/office-to-html', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    try {
      const htmlPath = await officeToHtml(file.path, UPLOADS);
      res.json({ file: path.basename(htmlPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires LibreOffice: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/html-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    try {
      await htmlToPdf(file.path, outPath);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires wkhtmltopdf: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/word-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    try {
      await pandocConvert(file.path, 'docx', 'pdf', outPath);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires pandoc: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/excel-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    try {
      await pandocConvert(file.path, 'xlsx', 'pdf', outPath);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires pandoc: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/ppt-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    try {
      await pandocConvert(file.path, 'pptx', 'pdf', outPath);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires pandoc: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/odt-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const outPath = path.join(UPLOADS, `${file.filename}.pdf`);
    try {
      await pandocConvert(file.path, 'odt', 'pdf', outPath);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires pandoc: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
