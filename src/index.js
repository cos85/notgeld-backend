import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notgeldRouter from './routes/notgeld.js';
import uploadRouter from './routes/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';



dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/upload', uploadRouter);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/notgeld', notgeldRouter);

app.get('/', (req, res) => {
  res.send('Notgeld API pronta!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
