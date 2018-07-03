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

  db.any(`SELECT tenants.*, rent.property_id, tenant_bills.status FROM tenants 
          JOIN rent ON tenants.id = rent.tenant_id
          JOIN properties ON rent.property_id = properties.id
          JOIN tenant_bills ON tenant_bills.tenant_id = tenants.id
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

const archiveTenant = (req, res, next) => {
  const userID = decodeJWT(req);
  const tenantID = req.params.id;

  db.none(`UPDATE tenants
          SET status='inactive'
          FROM users, properties, rent
          WHERE tenants.id = rent.tenant_id
          AND rent.property_id = properties.id
          AND properties.user_id = users.id 
          AND users.id = ${userID}
          AND tenants.id = ${tenantID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Archived tenant for property`
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        status: 'error',
        error,
      })
    })
}

const updateTenant = (req, res, next) => { 
  const userID = decodeJWT(req);
  const { firstName, lastName, email, phone, status, venmo } = req.body;
  const tenantID = req.params.id;

  db.one(`UPDATE tenants
          SET first_name='${firstName}',
              last_name='${lastName}',
              email='${email}',
              phone='${phone}',
              status='${status}',
              venmo='${venmo}'
          FROM users, properties, rent 
          WHERE tenants.id = rent.tenant_id
          AND rent.property_id = properties.id
          AND properties.user_id = users.id 
          AND users.id = ${userID}
          AND tenants.id = ${tenantID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Updated tenant for property`
      })
    })
    .catch(error => {
      res.status(500).json({
        status: 'error',
        error,
      })
    })
} 

module.exports = {
  getAllTenants,
  updateTenant,
  archiveTenant,
}