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
db.connect();

// Express middleware setup
app.use(bodyParser.json());
app.use(morgan('tiny'));
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
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);


app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.locals.user = req.user; 
  next();
});


app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs', { cssFile: '/CSS/Common/login.css' });
});

app.get('/register', (req, res) => {
  res.render('register.ejs', { cssFile: '/CSS/Common/register.css' });
});
app.get('/anime', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }try {
    res.render('anime.ejs', {
      cssFile: '/CSS/Common/anime.css',
      query: '',          
      animeData: []      
    });
  } 
  catch (err) {
    console.error("Error fetching user secret:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/video_playback',(req,res)=>{
  res.render('video_playback.ejs',{cssFile:'/CSS/Common/video_playback.css'});
});


app.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/'); 
  });
});


app.get('/auth/google',
  passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

app.get('/auth/google/secrets',
  passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
}));


app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

app.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect('/login');  
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
        } else {
          const result = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log('success');
            res.redirect('/login');  
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

passport.use(
  'local',
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query('SELECT * FROM users WHERE email = $1 ', [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb('User not found');
      }
    } catch (err) {
      console.log(err);
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

app.post('/search', async (req, res) => {
  const query = req.body.query;

  try {
   
    const response = await axios.get('https://api.jikan.moe/v4/anime', {
      params: {
        q: query,
        limit: 15 
      }
    });

    
    const animeData = response.data.data || [];  

   
    res.render('anime.ejs', {
      animeData: animeData,  
      query: query,          
      cssFile: '/CSS/Common/anime.css'
    });
  } catch (error) {
    console.error(error);
    res.render('anime.ejs', {
      animeData: [],  
      query: query,
      cssFile: '/CSS/Common/anime.css'
    });
  }
});


passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
