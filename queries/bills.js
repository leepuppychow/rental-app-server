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

const getAllBills = (req, res, next) => {
  const userID = decodeJWT(req);

  db.any(`SELECT bills.*, bills.property_id FROM bills 
          JOIN properties ON bills.property_id = properties.id
          JOIN users ON users.id = properties.user_id
          WHERE users.id = ${userID}`)
    .then(data => {
      res.status(200).json({
        status: 'success',
        message: 'retrieved all bills for this user',
        data: data,
      })
    })
    .catch((err) => next(err));
}

module.exports = {
  getAllBills: getAllBills,
}