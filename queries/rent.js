const options = {};
const pgp = require('pg-promise')(options);
const connectionString = 'postgres://localhost:5432/rental_app';
const db = pgp(connectionString);
const jwt = require('jsonwebtoken');

const decodeJWT = (req) => {
  const token = req.get('authorization');
  const userID = jwt.decode(token).id;
  return userID;
}

const setRentForProperty = (req, res, next) => {
  const userID = decodeJWT(req);
  const propertyID = req.params.property_id;
  const { amount } = req.body;

  db.none(`UPDATE rent 
          SET amount=${amount} 
          FROM users, properties
          WHERE rent.property_id = properties.id
          AND properties.user_id = users.id
          AND users.id = ${userID}
          AND rent.property_id = ${propertyID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Updated rent for property`
      })
    })
    .catch(err => next(err));
}

module.exports = {
  setRentForProperty: setRentForProperty,
}