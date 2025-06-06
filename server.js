require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const methodOverride = require("method-override");

const morgan = require("morgan");
const session = require('express-session');
const Word = require('./models/word');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"));

app.use(morgan('dev'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(require('./middleware/add-user-to-req-and-locals'));
app.get('/', async (req, res) => {
  const searchedItem = req.query.word || '';
  const query = searchedItem ? { name:searchedItem } : null;
  const word = await Word.findOne(query);
  res.render('home.ejs', { searchedItem, word});
 
});

app.use('/auth', require('./controllers/auth'));
app.use('/words', require('./controllers/words'));
app.use('/community', require('./controllers/users'));


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

