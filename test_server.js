import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import passport from 'passport';
import { Strategy } from 'passport-local';
import morgan from 'morgan';
import path from 'path';
import GoogleStrategy from 'passport-google-oauth2';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import session from 'express-session';
import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const saltRounds = 10;
const app = express();

// Set up PostgreSQL client
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Add console log for database connection
db.connect()
  .then(() => console.log('✅ Successfully connected to PostgreSQL database'))
  .catch((err) => console.error('❌ Database connection error:', err));

// Express middleware setup
app.use(bodyParser.json());
// Uncomment morgan for detailed HTTP request logging
// app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up view engine and views directory
app.set('views', path.join(__dirname, 'Public', 'views'));

// Session middleware setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // Set secure cookies in production
  })
);

// Passport initialization and session handling
app.use(passport.initialize());
app.use(passport.session());

// Middleware to log user activity
app.use((req, res, next) => {
  // Log incoming requests
  console.log(`📍 ${req.method} ${req.path}`);
  
  // Log authenticated user info if available
  if (req.user) {
    console.log(`👤 User: ${req.user.email || 'Unknown'}`);
  }
  
  res.locals.user = req.user; // Make the user object available to all views
  next();
});

// Routes for serving views
app.get('/', (req, res) => {
  console.log('🏠 Home page accessed');
  res.render('home.ejs');
});

app.get('/login', (req, res) => {
  console.log('🔐 Login page accessed');
  res.render('login.ejs', { cssFile: '/CSS/Common/login.css' });
});

app.get('/register', (req, res) => {
  console.log('📝 Registration page accessed');
  res.render('register.ejs', { cssFile: '/CSS/Common/register.css' });
});

app.get('/anime', async (req, res) => {
  if (!req.isAuthenticated()) {
    console.log('🚫 Unauthenticated access attempt to anime page');
    return res.redirect('/login');
  }
  
  try {
    console.log('📺 Anime page accessed');
    res.render('anime.ejs', {
      cssFile: '/CSS/Common/anime.css',
      query: '',          
      animeData: []      
    });
  } 
  catch (err) {
    console.error('❌ Error accessing anime page:', err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/video_playback',(req,res)=>{
  console.log('🎬 Video playback page accessed');
  res.render('video_playback.ejs',{cssFile:'/CSS/Common/video_playback.css'});
});

app.get('/logout', (req, res, next) => {
  console.log(`👋 User logging out: ${req.user ? req.user.email : 'Unknown'}`);
  
  req.logout(function (err) {
    if (err) {
      console.error('❌ Logout error:', err);
      return next(err);
    }
    res.redirect('/'); // Redirect to home page after logging out
  });
});

// Google OAuth Routes
app.get('/auth/google',
  passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

app.get('/auth/google/secrets',
  passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

// Local Login Route
app.post('/login', (req, res, next) => {
  console.log(`🔑 Login attempt for: ${req.body.username}`);
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('❌ Login authentication error:', err);
      return next(err);
    }
    if (!user) {
      console.log('❌ Login failed');
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      if (err) {
        console.error('❌ Login session error:', err);
        return next(err);
      }
      console.log(`✅ Successful login for: ${user.email}`);
      return res.redirect('/');
    });
  })(req, res, next);
});

// Registration Route
app.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  console.log(`📧 Registration attempt for: ${email}`);

  try {
    const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      console.log(`⚠️ Registration attempt for existing user: ${email}`);
      res.redirect('/login');  // Redirect to login if user already exists
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error('❌ Error hashing password:', err);
          return res.status(500).send('Registration failed');
        }
        
        try {
          const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, hash]
          );
          
          const user = result.rows[0];
          
          console.log(`✅ New user registered: ${email}`);
          
          req.login(user, (err) => {
            if (err) {
              console.error('❌ Login after registration error:', err);
              return res.status(500).send('Registration successful but login failed');
            }
            res.redirect('/login');
          });
        } catch (insertErr) {
          console.error('❌ User registration database error:', insertErr);
          res.status(500).send('Registration failed');
        }
      });
    }
  } catch (err) {
    console.error('❌ Registration process error:', err);
    res.status(500).send('Registration failed');
  }
});

// Passport local strategy with logging
passport.use(
  'local',
  new Strategy(async function verify(username, password, cb) {
    try {
      console.log(`🕵️ Verifying user: ${username}`);
      const result = await db.query('SELECT * FROM users WHERE email = $1 ', [
        username,
      ]);
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error('❌ Error comparing passwords:', err);
            return cb(err);
          } else {
            if (valid) {
              console.log(`✅ Successful authentication for: ${username}`);
              return cb(null, user);
            } else {
              console.log(`❌ Failed authentication for: ${username}`);
              return cb(null, false);
            }
          }
        });
      } else {
        console.log(`❌ User not found: ${username}`);
        return cb('User not found');
      }
    } catch (err) {
      console.error('❌ Authentication process error:', err);
      return cb(err);
    }
  })
);

passport.use(
    'google',
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/secrets',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          const result = await db.query('SELECT * FROM users WHERE email = $1', [
            profile.email,
          ]);
          if (result.rows.length === 0) {
            const newUser = await db.query(
              'INSERT INTO users (email, password) VALUES ($1, $2)',
              [profile.email, 'google']
            );
            return cb(null, newUser.rows[0]);
          } else {
            return cb(null, result.rows[0]);
          }
        } catch (err) {
          return cb(err);
        }
      }
    )
  );

// Search route with logging
app.post('/search', async (req, res) => {
  const query = req.body.query;

  console.log(`🔍 Anime search query: ${query}`);

  try {
    // Fetch anime data from Jikan API using Axios
    const response = await axios.get('https://api.jikan.moe/v4/anime', {
      params: {
        q: query,
        limit: 15
      }
    });

    // Extract anime data from the API response
    const animeData = response.data.data || [];

    console.log(`📺 Search results for '${query}': ${animeData.length} items`);

    // Render the anime search results and pass query and animeData to the template
    res.render('anime.ejs', {
      animeData: animeData,
      query: query,
      cssFile: '/CSS/Common/anime.css'
    });
  } catch (error) {
    console.error('❌ Anime search error:', error);
    res.render('anime.ejs', {
      animeData: [],
      query: query,
      cssFile: '/CSS/Common/anime.css'
    });
  }
});

passport.serializeUser((user, cb) => {
  console.log(`💾 Serializing user: ${user.email}`);
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  console.log(`🔓 Deserializing user: ${user.email}`);
  cb(null, user);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🕒 Startup time: ${new Date().toLocaleString()}`);
});