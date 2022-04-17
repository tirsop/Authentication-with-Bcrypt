import express from 'express'; //import express package
const app = express(); // abbreviation of the code
import User from './models/user.js';
import bcrypt from 'bcrypt';
import session from 'express-session';
import mongoose from 'mongoose';
mongoose
  .connect('mongodb://localhost:27017/50_authetication')
  .then(() => console.log(`--------------console.log\nDatabase connected\n`))
  .catch((err) => {
    console.log(`--------------console.log\nMONGO CONNECTION ERROR:`);
    console.log(err + `\n`);
  });

import path from 'path';
import { URL } from 'url';
const __dirname = new URL('.', import.meta.url).pathname;
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs'); // for requiring ejs files.
app.use(express.urlencoded({ extended: true })); // need this line to use req.body.  use runs a function in every single request.
const sessionConfig = {
  secret: 'not a good secret',
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionConfig));

const requireLogin = (req, res, next) => {
  if (!req.session.user_id) return res.redirect('/login');
  next();
};

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { password, username } = req.body;
  const user = new User({ username, password });
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/secret');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    req.session.user_id = foundUser._id;
    res.redirect('/secret');
  } else {
    res.redirect('/login');
  }
});

app.post('/logout', (req, res) => {
  req.session.user_id = null; // or  req.session.destroy();   which will delete all the information
  res.redirect('/login');
});

app.get('/secret', requireLogin, (req, res) => {
  res.render('secret');
});

const port = 3000;
app.listen(port, () => {
  console.log(`--------console.log\nListening at:\nhttp://localhost:${port}\n`);
});
