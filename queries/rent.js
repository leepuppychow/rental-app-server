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
  const propertyID = req.params.property_id;
  const { amount } = req.body;

  console.log("rent amount", amount)
  console.log("property ID", propertyID)

  db.none(`UPDATE rent SET amount=${amount} WHERE rent.property_id = ${propertyID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Updated rent for property with ID of ${propertyID}`
      })
    })
    .catch(err => next(err));
}

module.exports = {
  setRentForProperty: setRentForProperty,
}