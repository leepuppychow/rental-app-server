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
            SELECT '${type}', '${date}', ${amount}, ${propertyID}
            WHERE EXISTS (
              SELECT * FROM bills
              JOIN properties ON bills.property_id = properties.id
              JOIN users ON users.id = properties.user_id
              WHERE users.id = ${userID})
          RETURNING *`)
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

const updateBill = (req, res) => {
  const userID = decodeJWT(req);
  const billID = req.params.id;
  const { type, date, amount } = req.body;

  db.none(`UPDATE bills 
            SET type='${type}',
                date='${date}',
                amount=${amount}
            FROM users, properties
            WHERE bills.property_id = properties.id
            AND properties.user_id = users.id
            AND users.id = ${userID}
            AND bills.id = ${billID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Updated bill for property`
      })
    })
    .catch(err => console.log({ err }));
}

const deleteBill = (req, res) => {
  const userID = decodeJWT(req);
  const billID = req.params.id;

  db.none(`DELETE FROM bills USING properties, users
            WHERE bills.property_id = properties.id
            AND properties.user_id = users.id
            AND users.id = ${userID}
            AND bills.id = ${billID}`)
    .then(() => {
      res.status(202).json({
        status: 'success',
        message: 'Deleted bill successfully',
      })
    })
    .catch(error => {
      res.status(404).json({
        status: 'error',
        message: error,
      })
    })
}


module.exports = {
  getAllBills: getAllBills,
  addNewBill: addNewBill,
  deleteBill: deleteBill,
  updateBill: updateBill,
}