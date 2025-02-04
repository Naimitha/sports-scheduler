const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Sport = require('../models/sport');
const Session = require('../models/session');
const passport = require('passport');

// Home route (Landing page)
router.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

// Signup Route
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
  try {
    const saltRounds = 10;
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password: hashedPassword });
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Error during signup. Please try again.' });
  }
});

// Player - Create a new session (match)
router.get('/session/new', async (req, res) => {
  if (!req.user) return res.redirect('/login');
  const sports = await Sport.findAll();
  res.render('createSession', { sports, user: req.user }); // Pass user to the view
});

router.post('/session/new', async (req, res) => {
  if (!req.user) return res.redirect('/login');

  const { sportId, date, venue, additionalPlayers } = req.body;
  console.log('Creating session with:', { sportId, date, venue, additionalPlayers }); // Log the request data
  try {
    await Session.create({
      sportId,
      date,
      venue,
      additionalPlayers,
      status: 'active',
    });
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Error creating session:', err); // Log the error
    res.status(500).send('Error creating session: ' + err.message); // Send the error message
  }
});

// Other routes...

module.exports = router;
