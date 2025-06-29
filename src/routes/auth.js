import express from 'express';
import passport from 'passport';

const router = express.Router();

// Avvia login con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback dopo il login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/'); // oppure /form.html
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect('/');
  });
});

// Info utente
router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    const { displayName, emails } = req.user;
    res.json({
      authenticated: true,
      user: {
        displayName,
        email: emails?.[0].value
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

export default router;
