import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { videoToGif, audioConvert, videoConvert, createGif } from '../utils/mediaHelpers';

const router = Router();
const UPLOADS = path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({ destination: UPLOADS, filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname) });
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

router.post('/video-to-gif', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const fps = Number(req.body.fps) || 10;
    const width = Number(req.body.width) || 480;
    const outPath = path.join(UPLOADS, `${file.filename}.gif`);
    try {
      await videoToGif(file.path, outPath, fps, width);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires ffmpeg: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/audio-convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const format = req.body.format || 'mp3';
    const bitrate = req.body.bitrate || '192k';
    const outPath = path.join(UPLOADS, `${file.filename}.${format}`);
    try {
      await audioConvert(file.path, outPath, format, bitrate);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires ffmpeg: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/video-convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'no file' });
    const format = req.body.format || 'mp4';
    const bitrate = req.body.bitrate || '1000k';
    const outPath = path.join(UPLOADS, `${file.filename}.${format}`);
    try {
      await videoConvert(file.path, outPath, format, bitrate);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires ffmpeg: ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

router.post('/create-gif', upload.array('images'), async (req, res) => {
  try {
    const images = req.files as Express.Multer.File[] | undefined;
    if (!images || images.length === 0) return res.status(400).json({ error: 'no images' });
    const delay = Number(req.body.delay) || 100;
    const outPath = path.join(UPLOADS, `animated-${Date.now()}.gif`);
    try {
      await createGif(images.map(f => f.path), outPath, delay);
      res.json({ file: path.basename(outPath) });
    } catch (err: any) {
      res.status(500).json({ error: 'Requires ImageMagick (convert): ' + (err.message || String(err)) });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || String(err) });
  }
});

export default router;
