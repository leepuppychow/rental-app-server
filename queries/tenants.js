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

  db.any(`SELECT tenants.*, tenant_bills.status FROM tenants 
          JOIN properties ON tenants.property_id = properties.id
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

const toggleTenantActive = (req, res, next) => {
  const userID = decodeJWT(req);
  const tenantID = req.params.id;
  const active = req.query.active;

  db.none(`UPDATE tenants
          SET active=${active}
          FROM users, properties
          WHERE tenants.property_id = properties.id
          AND properties.user_id = users.id 
          AND users.id = ${userID}
          AND tenants.id = ${tenantID}`)
    .then(() => {
      res.status(200).json({
        status: 'success',
        message: `Tenant's active status was updated to ${active}`
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

const createTenant = (req, res, next) => {
  const userID = decodeJWT(req);
  const { firstName, lastName, email, phone, active, venmo, propertyID } = req.body;
  let newTenantID;

  db.one(`INSERT INTO tenants(property_id, first_name, last_name, email, phone, venmo, active)
          VALUES (${propertyID}, ${firstName}, ${lastName}, ${email}, ${phone}, ${venmo}, ${active})
          RETURNING tenants.id`)
    .then((response) => {
      newTenantID = response.id;
      // Should tenant_bills.date just be Current date?
      db.none(`INSERT INTO tenant_bills(split_amount, status, tenant_id, date)
               VALUES(null, 'unpaid', ${newTenantID}, CURRENT_DATE)`)
        .then(() => {
          console.log(`successfully added to tenant_bills for tenant: ${newTenantID}`)
        })
        .catch(error => console.log(error));      
    })
    .then(() => {
      res.status(201).json({
        status: 'success',
        message: `Created new tenant`,
      })
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        status: 'error',
        message: error,
      })
    })
}

const updateTenant = (req, res, next) => { 
  const userID = decodeJWT(req);
  const { firstName, lastName, email, phone, active, venmo } = req.body;
  const tenantID = req.params.id;

  db.none(`UPDATE tenants
          SET first_name='${firstName}',
              last_name='${lastName}',
              email='${email}',
              phone='${phone}',
              active='${active}',
              venmo='${venmo}'
          FROM users, properties
          WHERE tenants.property_id = properties.id
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
  createTenant,
  toggleTenantActive,
}