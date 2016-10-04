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

router.get('/Wet3VideoIframe', function(req, res, next) {
  res.render('Wet3VideoIframe');
});

router.get('/Wet4VideoIframe', function(req, res, next) {
  res.render('Wet4VideoIframe');
});

router.get('/app_iframe.html', function(req, res, next) {
  res.render('app_iframe', { title: "Canada's Energy Future Visualization" });
});


module.exports = router;
