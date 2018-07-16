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

  db.any(`SELECT tenants.*, tenant_bills.status, rooms.property_id FROM tenants 
          JOIN rooms on rooms.tenant_id = tenants.id
          JOIN properties ON rooms.property_id = properties.id
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
          FROM users, properties, rooms
          WHERE tenants.id = rooms.tenant_id
          AND rooms.property_id = properties.id
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

  db.one(`INSERT INTO tenants(first_name, last_name, email, phone, venmo, active)
          VALUES (${firstName}, ${lastName}, ${email}, ${phone}, ${venmo}, ${active})
          RETURNING tenants.id`)
    .then((response) => {
      newTenantID = response.id;
      db.none(`INSERT INTO tenant_bills(split_amount, status, tenant_id, date)
               VALUES(null, 'unpaid', ${newTenantID}, CURRENT_DATE)`)
        .then(() => {
          console.log(`successfully added to tenant_bills for tenant: ${newTenantID}`)
        })
        .catch(error => console.log(error));      
    })
    .then(() => {

      // NEED TO FIX the room process here (UI should have user pick a room and decide rent)

      db.none(`INSERT INTO rooms(name, rent, sq_ft, property_id, tenant_id
                VALUES('ROOM_NAME', 5000, 250, ${propertyID}, ${newTenantID})`)
        .then(() => {
          console.log(`successfully added to rooms for tenant: ${newTenantID}`)
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
          FROM users, properties, rooms
          WHERE tenants.id = rooms.tenant_id
          AND rooms.property_id = properties.id
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