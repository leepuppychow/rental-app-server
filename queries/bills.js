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
          WHERE users.id = ${userID}
          AND bills.date > CURRENT_DATE - 31`)
    .then(data => {
      res.status(200).json({
        status: 'success',
        message: 'retrieved all bills for this user',
        data: data,
      })
    })
    .catch((err) => next(err));
}

const addNewBill = (req, res, next) => {
  const userID = decodeJWT(req);
  const { propertyID, type, date, amount } = req.body;

  db.one(`INSERT INTO bills(type, date, amount, property_id)
          VALUES(${type}, ${date}, ${amount}, ${propertyID})`)
    .then(() => {
      res.status(201).json({
        status: 'success',
        message: `Created new bill`,
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        message: error,
      })
    })
}


module.exports = {
  getAllBills: getAllBills,
  addNewBill: addNewBill,
}