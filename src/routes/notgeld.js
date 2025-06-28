import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const lista = await prisma.notgeld.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero dei notgeld' });
  }
});


router.post('/', async (req, res) => {
  try {
    const data = req.body;

    const nuovoNotgeld = await prisma.notgeld.create({
      data: {
        citta: data.citta,
        issue: data.issue,
        valore: data.valore,
        valuta: data.valuta,
        catalogo: data.catalogo,
        codice_catalogo: data.codice_catalogo,
        url_fronte: data.url_fronte,
        url_retro: data.url_retro,
        trascrizione_fronte: data.trascrizione_fronte,
        trascrizione_retro: data.trascrizione_retro,
        traduzione_fronte: data.traduzione_fronte,
        traduzione_retro: data.traduzione_retro,
        note: data.note,
        verificato: data.verificato,
        conservazione: data.conservazione,
      },
    });

    res.json(nuovoNotgeld);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante la creazione del notgeld' });
  }
});

// API: lettere iniziali presenti
router.get('/lettere', async (req, res) => {
  const lettere = await prisma.notgeld.findMany({
    select: {
      citta: true
    }
  });

  const iniziali = [...new Set(lettere.map(n => n.citta[0].toUpperCase()))];
  res.json(iniziali.sort());
});

// API: notgeld filtrati per iniziale
router.get('/', async (req, res) => {
  const { iniziale } = req.query;

  if (iniziale) {
    const lista = await prisma.notgeld.findMany({
      where: {
        citta: {
          startsWith: iniziale,
          mode: 'insensitive'
        }
      },
      orderBy: { citta: 'asc' }
    });
    return res.json(lista);
  }

  // fallback: tutti
  const lista = await prisma.notgeld.findMany({
    orderBy: { created_at: 'desc' }
  });
  res.json(lista);
});

export default router;
