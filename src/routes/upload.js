import express from 'express';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2Client from '../lib/r2Client.js';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const sanitizedOriginal = file.originalname
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');

    const filename = `${randomUUID()}_${sanitizedOriginal.replace(/\.[^.]+$/, '')}.jpg`;
    const bucket = process.env.R2_BUCKET;

    const bufferCompresso = await sharp(file.buffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const uploadParams = {
      Bucket: bucket,
      Key: filename,
      Body: bufferCompresso,
      ContentType: 'image/jpeg',
    };

    await r2Client.send(new PutObjectCommand(uploadParams));

    res.json({ filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante upload su R2' });
  }
});

export default router;
