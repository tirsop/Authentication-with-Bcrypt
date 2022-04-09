import express from 'express'; //import express package
const app = express(); // abbreviation of the code
import User from './models/user.js';
import bcrypt from 'bcrypt';
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

app.get('/', (req, res) => {
  res.send('THIS IS THE HOME PAGE');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  res.redirect('/');
});

app.get('/secret', (req, res) => {
  res.send('This is a secret!.you cannot see unless login');
});

const port = 3000;
app.listen(port, () => {
  console.log(`--------console.log\nListening at:\nhttp://localhost:${port}\n`);
});
