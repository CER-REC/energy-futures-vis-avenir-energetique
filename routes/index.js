var express = require('express');
var router = express.Router();


// Direct the root to the newer template
router.get('/', function(req, res, next) {
  res.render('WET4', { title: 'WET 3.1.12' });
});

router.get('/WET3', function(req, res, next) {
  res.render('WET3', { title: 'WET 3.1.12' });
});

router.get('/WET4', function(req, res, next) {
  res.render('WET4', { title: 'WET 4.0.20' });
});

router.get('/Wet3Video', function(req, res, next) {
  res.render('Wet3Video');
});

router.get('/Wet4Video', function(req, res, next) {
  res.render('Wet4Video');
});

module.exports = router;
