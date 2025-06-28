import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// API: crea un notgeld
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
  try {
    const lettere = await prisma.notgeld.findMany({
      select: { citta: true }
    });

    const iniziali = [...new Set(lettere.map(n => n.citta?.[0]?.toUpperCase()).filter(Boolean))];
    res.json(iniziali.sort());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero delle lettere iniziali' });
  }
});

// API: elenco notgeld (opzionalmente filtrato per iniziale)
router.get('/', async (req, res) => {
  try {
    const { iniziale } = req.query;

    const lista = await prisma.notgeld.findMany({
      where: iniziale
        ? {
            citta: {
              startsWith: iniziale,
              mode: 'insensitive'
            }
          }
        : undefined,
      orderBy: iniziale ? { citta: 'asc' } : { created_at: 'desc' }
    });

    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero dei notgeld' });
  }
});

export default router;
