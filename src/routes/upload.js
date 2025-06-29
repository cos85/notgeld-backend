import express from 'express';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import r2Client from '../lib/r2Client.js';
import { randomUUID } from 'crypto';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const sanitizedOriginal = file.originalname.replace(/\s+/g, '_');
    const filename = `${randomUUID()}_${sanitizedOriginal}`;

    const bucket = process.env.R2_BUCKET;

    const uploadParams = {
      Bucket: bucket,
      Key: filename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await r2Client.send(new PutObjectCommand(uploadParams));

    const url = `https://${process.env.R2_BUCKET}.${process.env.R2_ENDPOINT.replace(/^https?:\/\//, '')}/${filename}`;
    res.json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante upload su R2' });
  }
});

export default router;
