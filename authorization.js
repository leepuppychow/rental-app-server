const jwt = require('jsonwebtoken');
const _ = require('lodash');

const createTokenID = (user) => {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

const decodeJWT = (req) => {
  const token = req.get('authorization');
  const userID = jwt.decode(token).id;
  return userID;
}

module.exports = {
  createTokenID: createTokenID,
  decodeJWT: decodeJWT,
}