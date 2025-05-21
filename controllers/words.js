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
    const newMeaning = await Meaning.create({
      explanation: req.body.explanation,
      image: req.body.image,
      contributor: req.session.userId,
    });
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

 const userId = req.session.userId;
 const word = await Word.findById(req.params.id)
 .populate('owner')
 .populate({
  path: 'meanings',
  populate: { path: 'contributor' } 
});
console.log('userId:', userId);
word.meanings.forEach(m => {
  console.log('contributor:', m.contributor?._id.toString());
});
console.log('owner:', word.owner?._id.toString());
 res.render('words/show.ejs', { word, userId });

});

router.get('/:id/meanings/:meaningId/edit', async (req, res) => {
  const word = await Word.findById(req.params.id)
  .populate('owner')
  .populate('meanings'); 
  const meaning = await Meaning.findById(req.params.meaningId);
  res.render('words/edit.ejs', {word, meaning});
});

router.put('/:id/meanings/:meaningId', async(req, res) => {
  try {
    await Meaning.findByIdAndUpdate(req.params.meaningId, req.body);
    res.redirect(`/words/${req.params.id}`);
    
  } catch (err) {
    console.log(err);
    res.redirect('/');
    
  }
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.session.userId, {
    $pull: { dictionary: req.params.id}
  });
  res.redirect('/words');
});


module.exports = router;