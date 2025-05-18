const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Word = require('../models/word');
const Meaning = require('../models/meaning');
const ensureLoggedIn = require('../middleware/ensure-logged-in');
router.use(ensureLoggedIn);

router.get('/', async (req, res) => {
  const user = await User.findById(req.session.userId).populate('dictionary');
  const words = user.dictionary;
  res.render('words/index.ejs', {words});
});


router.get('/new', (req, res) => {
  res.render('words/new.ejs');
});

router.post('/', async(req, res) => {
  try {
    req.body.owner = req.session.userId;
    const newMeaning = await Meaning.create(req.body);
    const word = await Word.create({
      name: req.body.name,
      owner: req.body.owner,
      meanings: [newMeaning._id],
    });
    await User.findByIdAndUpdate(req.session.userId, {
      $addToSet: { dictionary: word._id }
    });    
    res.redirect('/words');
    
  } catch (err) {
    console.log(err);
    res.render('words/new.ejs'); 
  }
  
});

router.get('/:id', async (req, res) => {
 const word = await Word.findById(req.params.id).populate('meanings'); 
 res.render('words/show.ejs', { word });

});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.session.userId, {
    $pull: { dictionary: req.params.id}
  });
  res.redirect('/words');
});

router.get('/:id/edit', async (req, res) => {
  const word = await Word.findById(req.params.id).populate('meanings'); 
  if (!word.owner.equals(req.session.userId)) {
    return res.redirect('/words');
  };
  res.render('words/edit.ejs', {word});
});

router.put('/:id', async(req, res) => {
  try {
    const word = await Word.findById(req.params.id);
      await Meaning.findByIdAndUpdate(
      word.meanings[0],
      {explanation: req.body.explanation, image: req.body.image}
    );

    res.redirect(`/words/${req.params.id}`);
    
  } catch (err) {
    console.log(err);
    res.redirect('/');
    
  }
});

module.exports = router;