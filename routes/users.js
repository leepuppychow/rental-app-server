var express = require('express');
var router = express.Router();
const argon2 = require('argon2');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', (req, res, next) => {
  console.log("body", req.body)

  const { username, password } = req.body;


  argon2.hash(password)
    .then(hash => {
      res.status(200).json({
        hash: hash,
      })
    }).catch(err => {
      res.status(500).json({
        error: "Failed to signup for account",
      })
    });
})

router.post('/login', (req, res, next) => {
  // Add logic here to check if password is correct
  argon2.verify('<big long hash>', 'password').then(match => {
    if (match) {
      // password match
    } else {
      // password did not match
    }
  }).catch(err => {
    // internal failure
  });
})

module.exports = router;
