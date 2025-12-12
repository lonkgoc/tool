import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import pdfRoutes from './routes/pdf';
import imageRoutes from './routes/image';
import archiveRoutes from './routes/archive';
import officeRoutes from './routes/office';
import mediaRoutes from './routes/media';

const app = express();
app.use(cors());
app.use(express.json());

const UPLOADS = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOADS)) fs.mkdirSync(UPLOADS, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.post('/api/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'no file' });
  res.json({ filename: file.filename, path: file.path, size: file.size });
});

app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/office', officeRoutes);
app.use('/api/media', mediaRoutes);

app.get('/api/uploads/:name', (req, res) => {
  const filePath = path.join(UPLOADS, req.params.name);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');
  res.sendFile(filePath);
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 4010;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
