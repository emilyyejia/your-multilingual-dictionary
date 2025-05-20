const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Word = require('../models/word');
const Meaning = require('../models/meaning');
const ensureLoggedIn = require('../middleware/ensure-logged-in');

router.get('/', async (req, res) => {
    const words = await Word.find({})
    .populate('owner')
    .populate({
      path: 'meanings',
      populate: { path: 'contributor' } 
  });
    res.render('users/index.ejs', { words });
});

router.get('/:id', async (req, res) => {
    const word = await Word.findById(req.params.id).populate('meanings'); 
    res.render('users/show.ejs', {word});
});

router.get('/:id/new', ensureLoggedIn, async (req, res) => {
  const word = await Word.findById(req.params.id)
  res.render('users/new.ejs', {word});
});

router.post('/:id/contribute', ensureLoggedIn, async (req, res) => {
  try {
    req.body.contributor = req.session.userId;
    const newMeaning = await Meaning.create(req.body);
    await Word.findByIdAndUpdate(
        req.params.id,
        { $push: {meanings: newMeaning._id} }
    );
  
    res.redirect(`/community/${req.params.id}`);
    
  } catch (err) {
    console.log(err);
    res.render('words/new.ejs'); 
  }
  
});

router.post('/:id/dictionary', ensureLoggedIn, async ( req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.userId, {
            $addToSet: { dictionary: req.params.id }
        });
        res.redirect('/words'); 
    } catch (err) {
        console.log(err);
        res.redirect(`/community/${req.params.id}`);
        
    }
});



module.exports = router;