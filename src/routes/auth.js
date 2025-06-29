import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // oppure /carica.html
  }
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

export default router;
