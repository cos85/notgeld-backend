import express from 'express';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import r2Client from '../lib/r2Client.js';

const router = express.Router();

router.get('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: filename,
    });

    const signedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 900 // 15 minuti
    });

    res.redirect(signedUrl);
  } catch (error) {
    console.error('Errore /immagine:', error);
    res.status(500).send('Errore nel recupero immagine');
  }
});

export default router;
