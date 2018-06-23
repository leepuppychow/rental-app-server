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

router.post('/users', (req, res, next) => {
  query.createUser(req.body)
    .then(user => {
      res.status(201).json({
        status: "success",
        message: "User created successfully",
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
              token_id: createTokenID(user),
            })
          } else {
            console.log("Password did not match");
          } 
        })
      })
    .catch(error => {
      console.log(error);
      res.status(401).json({
        status: "error",
        message: "login failed",
      });
    })
})

module.exports = router;
