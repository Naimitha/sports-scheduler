// app.js
const express = require('express');
const ejs = require('ejs');
const passport = require('passport');
const session = require('express-session');
const bcrypt = require('bcryptjs')
// const csurf = require('csurf');
const sequelize = require('./config/database');
const User = require('./models/user');
const Sport = require('./models/sport');
const Session = require('./models/session');
const LocalStrategy = require('passport-local').Strategy;
const router = require('./routes/index');


const app = express();

// Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: 'sports_scheduler_secret', resave: false, saveUninitialized: true }));
// app.use(csurf());
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

// Passport Local Strategy for Authentication
passport.use(
  new LocalStrategy(
    { usernameField: 'email',
      passwordField:'password'
     }, // Specify that 'email' is the username field
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        // console.log(user)
        
        if (!user) {
          return done(null, false, { message: 'User not found' }); // Return a user not found error
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect password' }); // Return incorrect password error
        }

        return done(null, user); // If everything is good, return the user
      } catch (err) {
        return done(err); // Handle error
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log("Error at serializew user")
  done(null, user.id)});
passport.deserializeUser(async (id, done) => {
  const user = await User.findByPk(id);
  // console.log(user.name)
  done(null, user);
});

// Routes
app.use((req, res, next) => {
  res.locals.user = req.user; // This makes 'user' available globally in views
  next();
});

app.get('/', (req, res) => res.render('index', { user: req.user }));

// Signup Route
app.get('/signup', (req, res) => res.render('signup'));

app.post('/signup', async (req, res) => {
  try {
    const saltRounds = 10;
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password });
    res.redirect('/login');
  } catch (err) {
    console.error(err)
    res.status(500).json({error:err});
  }
});

// Login Route
app.get('/login', (req, res) => res.render('login'));

app.post('/login', passport.authenticate('local', { failureRedirect: '/login'   }), (req, res) => {
  res.redirect('/');
});

// Dashboard Route
app.get('/dashboard', async (req, res) => {
  if (!req.user) return res.redirect('/login');
  const sports = await Sport.findAll();
  const sessions = await Session.findAll();
  // console.log(sessions)
  res.render('dashboard', { user: req.user, sports ,sessions});
});

// Logout Route
app.get('/logout', (req, res) => {
  req.logout((err) => res.redirect('/'));
});

sequelize.sync().then(() => {
  console.log('Database synced successfully.');
}).catch(err => {
  console.error('Database sync failed:', err);
});


// Start the Server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
