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
// API: lista città uniche per iniziale
router.get('/', async (req, res) => {
  const { iniziale } = req.query;

  if (iniziale) {
    const risultati = await prisma.notgeld.findMany({
      where: {
        citta: {
          startsWith: iniziale,
          mode: 'insensitive'
        }
      },
      select: { citta: true },
      orderBy: { citta: 'asc' }
    });

    const uniche = [...new Set(risultati.map(n => n.citta))];
    return res.json(uniche);
  }

  const lista = await prisma.notgeld.findMany({
    orderBy: { created_at: 'desc' }
  });
  res.json(lista);
});


// API: dettaglio notgeld per ID
router.get('/:id', async (req, res) => {
  try {
    const notgeld = await prisma.notgeld.findUnique({
      where: { id: req.params.id }
    });

    if (!notgeld) return res.status(404).json({ error: 'Notgeld non trovato' });

    res.json(notgeld);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore nel recupero del dettaglio' });
  }
});

// API: tutti i notgeld di una città
router.get('/citta/:nome', async (req, res) => {
  try {
    const lista = await prisma.notgeld.findMany({
      where: {
        citta: {
          equals: req.params.nome,
          mode: 'insensitive'
        }
      },
      orderBy: { created_at: 'asc' }
    });

    res.json(lista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore durante il recupero dei notgeld della città' });
  }
});


export default router;
