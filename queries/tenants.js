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

const getAllTenants = (req, res, next) => {
  const userID = decodeJWT(req);

  db.any(`SELECT tenants.*, rent.property_id FROM tenants 
          JOIN rent ON tenants.id = rent.tenant_id
          JOIN properties ON rent.property_id = properties.id
          JOIN users ON users.id = properties.user_id
          WHERE users.id = ${userID}`)
    .then(data => {
      res.status(200).json({
        status: 'success',
        message: 'retrieved all tenants for this user',
        data: data,
      })
    })
    .catch((err) => next(err));
}

module.exports = {
  getAllTenants: getAllTenants,
}