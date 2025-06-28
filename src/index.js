import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import notgeldRouter from './routes/notgeld.js';
import uploadRouter from './routes/upload.js';



dotenv.config();
const app = express();

app.use('/upload', uploadRouter);
app.use(cors());
app.use(express.json());

app.use('/notgeld', notgeldRouter);

app.get('/', (req, res) => {
  res.send('Notgeld API pronta!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
