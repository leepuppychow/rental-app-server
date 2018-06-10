const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const config = require('../config');
const _ = require('lodash');
const query = require('../queries/users.js');

const jwt = require('jsonwebtoken');

const createTokenID = (user) => {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

const createAccessToken = () => {
  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (60*60),
    scope: 'full',
    jti: genJti(),
    alg: 'HS256',
  }, config.secret);
}

const genJti = () => {
  let jti = '';
  let possible = 'abcdefghijklmnopqrstuvwzyz';
  for (let i = 0; i < 16; i++) {
    jti += possible.charAt(Math.floor(Math.random() + possible.length));
  }
  return jti;
}

router.post('/users', (req, res, next) => {
  query.createUser(req.body)
    .then(user => {
      res.status(201).json({
        status: "success",
        message: "User created successfully",
        access_token: createAccessToken(),
        token_id: createTokenID(user),
      })
    })
    .catch(error => {
      res.status(400).json({
        status: "error",
        message: error,
      })
    })
})

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  
  query.findUser(username)
    .then(user => {
      argon2.verify(user.password, password)
        .then(match => {
          if (match) {
            res.status(201).json({
              status: "success",
              message: "login successful",
              access_token: createAccessToken(),
              token_id: createTokenID(user),
            })
          } else {
            res.status(401).json({
              status: "error",
              message: "login failed",
            })
          }
        })
        .catch(error => console.log(error))
    })
    .catch(error => {
      console.log(error);
    })
})

module.exports = router;
