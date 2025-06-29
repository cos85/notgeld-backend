import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import notgeldRouter from './routes/notgeld.js';
import uploadRouter from './routes/upload.js';
import immagineRouter from './routes/immagine.js';
import authRouter from './routes/auth.js';
import ensureAuthenticated from './middleware/ensureAuthenticated.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === CONFIGURAZIONE PASSPORT ===

const allowedEmail = 'cosimo.allegretti@gmail.com'; // Cambia se necessario

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails?.[0].value;
  if (email === allowedEmail) return done(null, profile);
  return done(null, false);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// === MIDDLEWARE ===
app.use(session({
  secret: process.env.SESSION_SECRET || 'una-frase-lunga-segreta',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());

// === ROTTE ===
app.use('/upload', uploadRouter);
app.use('/notgeld', notgeldRouter);
app.use('/immagine', immagineRouter);
app.use('/auth', authRouter);

// === FILE STATICI ===
const publicPath = path.join(__dirname, '../public');
app.use('/form.html', ensureAuthenticated, express.static(path.join(publicPath, 'form.html')));
app.use('/modifica.html', ensureAuthenticated, express.static(path.join(publicPath, 'modifica.html')));
app.use(express.static(publicPath));

// === HOMEPAGE ===
app.get('/', (req, res) => {
  res.send('Notgeld API pronta!');
});

// === AVVIO SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
